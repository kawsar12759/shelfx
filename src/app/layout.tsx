import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShelfX — Your reading life, beautifully organized",
    template: "%s · ShelfX",
  },
  description:
    "Discover books, build your personal shelf, track your reading progress and share reviews with a community of readers.",
  openGraph: {
    siteName: "ShelfX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${playfair.variable} ${dmSans.variable} antialiased flex min-h-screen flex-col`}
        >
          <NavBar />
          <ToastContainer position="bottom-right" theme="colored" autoClose={2500} />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
