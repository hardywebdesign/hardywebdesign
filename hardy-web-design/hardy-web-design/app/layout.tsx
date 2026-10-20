import type { Metadata } from "next";
import { STUDIO_NAME, STUDIO_TAGLINE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: STUDIO_NAME, template: `%s · ${STUDIO_NAME}` },
  description: STUDIO_TAGLINE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Instrument+Serif:ital@0;1&display=swap"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='28' fill='%23FF5C39'/><text x='50' y='70' font-size='60' font-family='Arial' font-weight='bold' fill='white' text-anchor='middle'>H</text></svg>"
        />
      </head>
      <body className="min-h-screen">
        <header className="border-b-2 border-line">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
            <a href="/" className="logo flex items-center gap-2.5 no-underline" aria-label={`${STUDIO_NAME} home`}>
              <span className="logo-mark">H</span>
              <span className="flex flex-col font-display text-xl font-extrabold leading-none">
                Hardy
                <em className="font-serif text-[0.95rem] font-normal text-muted">web design</em>
              </span>
            </a>
            <a href="/#work" className="font-semibold underline-offset-4 hover:underline">
              ← See my work
            </a>
          </div>
        </header>
        {children}
        <footer className="border-t-2 border-line">
          <div className="mx-auto flex max-w-3xl flex-wrap justify-between gap-2 px-4 py-6 text-sm text-muted">
            <span>
              © {new Date().getFullYear()} {STUDIO_NAME}
            </span>
            <a href="/" className="font-semibold text-ink">
              Back to the home page
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
