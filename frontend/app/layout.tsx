import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CatchAm AI — Your shield against synthetic identity fraud",
  description:
    "24/7 automated deepfake detection for Nigerian enterprises, public figures, and everyday Nigerians. Upload a file or paste a link. Know if it is real or synthetic before you act.",
  openGraph: {
    title: "CatchAm AI — Your shield against synthetic identity fraud",
    description:
      "24/7 automated deepfake detection. Upload a file or paste a link. Know if it is real or synthetic before you act.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-primary font-sans text-text-primary" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
