import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Public_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";

// Archivo's width axis gives us condensed, spine-style headings
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "ShelfX — track what you read",
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
          className={`${archivo.variable} ${publicSans.variable} ${plexMono.variable} antialiased flex min-h-screen flex-col`}
        >
          <NavBar />
          <ToastContainer position="bottom-right" theme="light" autoClose={2500} />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
