import type { Metadata } from "next";
import { Hahmlet } from "next/font/google";
import "./globals.css";
// Hahmlet
const hahmlet = Hahmlet({
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "함온성",
  description: "함께하는 온라인 성경통독",
  openGraph: {
    title: "함온성",
    description: "함께하는 온라인 성경통독",
    type: "website",
    images: [
      {
        url: "https://bible-reading-nu.vercel.app/mainlogo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${hahmlet.className} antialiased`}>{children}</body>
    </html>
  );
}
