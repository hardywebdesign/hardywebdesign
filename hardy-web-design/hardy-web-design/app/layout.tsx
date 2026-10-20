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
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=DM+Sans:opsz,wght@9..40,400..700&display=swap"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen">
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
            <a href="/" className="logo flex items-center gap-3 no-underline" aria-label={`${STUDIO_NAME} home`}>
              <span className="logo-mark" aria-hidden="true">
                N
              </span>
              <span className="flex flex-col font-display text-2xl font-medium leading-none">
                Novela
                <small className="mt-1.5 font-body text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-muted">
                  Creative Co.
                </small>
              </span>
            </a>
            <a href="/#work" className="font-semibold underline-offset-4 hover:underline">
              ← See our work
            </a>
          </div>
        </header>
        {children}
        <footer className="border-t border-line">
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
