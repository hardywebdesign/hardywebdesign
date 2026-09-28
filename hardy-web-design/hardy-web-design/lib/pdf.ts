import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { Answers, SECTIONS, isAnswered } from "./questions";

const PAGE_W = 612; // US Letter
const PAGE_H = 792;
const MARGIN = 54;
const CONTENT_W = PAGE_W - MARGIN * 2;

const INK = rgb(0.11, 0.14, 0.17);
const MUTED = rgb(0.37, 0.42, 0.44);
const ACCENT = rgb(0.11, 0.42, 0.4);
const RULE = rgb(0.86, 0.89, 0.88);

export async function buildQuestionnairePdf(answers: Answers, opts: { studio: string; submittedAt: Date }) {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const client = String(answers.business_name || answers.contact_name || "New client");
  doc.setTitle(`Website questionnaire — ${sanitize(client, regular)}`);
  doc.setAuthor(opts.studio);
  doc.setCreator(opts.studio);

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const newPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  };
  const ensure = (needed: number) => {
    if (y - needed < MARGIN) newPage();
  };
  const write = (text: string, font: PDFFont, size: number, color = INK, indent = 0, gap = 1.35) => {
    const lines = wrap(sanitize(text, font), font, size, CONTENT_W - indent);
    for (const line of lines) {
      ensure(size * gap);
      y -= size * gap;
      page.drawText(line, { x: MARGIN + indent, y, size, font, color });
    }
  };

  // Header
  write(opts.studio.toUpperCase(), bold, 9, ACCENT);
  y -= 6;
  write("Website Discovery Questionnaire", bold, 20, INK);
  y -= 2;
  const when = opts.submittedAt.toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/New_York",
  });
  write(`${client}  ·  Submitted ${when}`, regular, 10, MUTED);

  for (const section of SECTIONS) {
    ensure(48);
    y -= 22;
    write(section.title, bold, 13, ACCENT);
    y -= 5;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.75, color: RULE });
    y -= 4;

    for (const q of section.questions) {
      const v = answers[q.id];
      ensure(34);
      y -= 8;
      write(q.label, bold, 10.5, INK);
      if (!isAnswered(v)) {
        write("No answer", regular, 10.5, MUTED);
      } else if (Array.isArray(v)) {
        for (const item of v) write(`•  ${item}`, regular, 10.5, INK, 8);
      } else {
        for (const para of v.split(/\r?\n/)) write(para || " ", regular, 10.5, INK);
      }
    }
  }

  // Page numbers
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const label = `${i + 1} / ${pages.length}`;
    p.drawText(label, {
      x: PAGE_W - MARGIN - regular.widthOfTextAtSize(label, 8),
      y: MARGIN / 2,
      size: 8,
      font: regular,
      color: MUTED,
    });
  });

  return doc.save();
}

/** Standard PDF fonts only cover Latin characters; swap anything else so the PDF never fails to build. */
function sanitize(text: string, font: PDFFont) {
  const supported = new Set(font.getCharacterSet());
  let out = "";
  for (const ch of text.replace(/\t/g, "    ")) {
    const code = ch.codePointAt(0)!;
    out += supported.has(code) ? ch : ch === "’" || ch === "‘" ? "'" : "?";
  }
  return out;
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= width) {
      line = test;
      continue;
    }
    if (line) lines.push(line);
    // Break very long words (like URLs) across lines.
    let rest = word;
    while (font.widthOfTextAtSize(rest, size) > width) {
      let i = rest.length;
      while (i > 1 && font.widthOfTextAtSize(rest.slice(0, i), size) > width) i--;
      lines.push(rest.slice(0, i));
      rest = rest.slice(i);
    }
    line = rest;
  }
  lines.push(line);
  return lines;
}
