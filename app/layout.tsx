import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const SITE_NAME = "Cedar Ridge Ward Sacrament Meetings";
const SITE_DESCRIPTION =
  "This Sunday's sacrament meeting program and past programs for Cedar Ridge Ward: speakers, hymns, prayers, and announcements.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Cedar Ridge Ward",
    default: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* First focusable element: lets keyboard users jump past the header navigation. */}
        <a
          href="#main"
          className="sr-only rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to main content
        </a>
        <Header />
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-page flex-1 px-4 py-8 focus:outline-none"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}