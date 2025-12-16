import type { Metadata } from "next";
import { Playfair } from "next/font/google";
import "./globals.css";
import NavBar from "../../components/NavBar";

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Shelfx",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.className} antialiased bg-[#FBFAF8]`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
