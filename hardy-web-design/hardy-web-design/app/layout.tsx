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
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Source+Sans+3:wght@400;600&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <a href="/" className="font-display text-lg font-bold tracking-tight">
              {STUDIO_NAME}
            </a>
          </div>
        </header>
        {children}
        <footer className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-muted">
            © {new Date().getFullYear()} {STUDIO_NAME}
          </div>
        </footer>
      </body>
    </html>
  );
}
