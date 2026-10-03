import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import { ConfirmProvider } from "../../components/ConfirmDialog";

// Literary serif with optical sizes, for headings
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Archivo's width axis gives us condensed spine lettering
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

export const viewport: Viewport = {
  themeColor: "#F4F5F0",
};

// Clerk's sign-in modal and account menu, dressed in the site's ink and type
const clerkAppearance = {
  variables: {
    colorPrimary: "#141B34",
    colorText: "#141B34",
    colorTextSecondary: "#5A6072",
    colorBackground: "#FCFCFA",
    colorInputBackground: "#FFFFFF",
    colorDanger: "#B42318",
    borderRadius: "0.625rem",
    fontFamily: "var(--font-public-sans), ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    headerTitle: { fontFamily: "var(--font-newsreader), Georgia, serif", fontWeight: 420, fontSize: "1.6rem", letterSpacing: "-0.018em" },
    formButtonPrimary: { borderRadius: "9999px", textTransform: "none" as const },
    card: { boxShadow: "0 2px 4px rgba(20,27,52,0.06), 0 24px 48px -16px rgba(20,27,52,0.3)" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <body
          className={`${newsreader.variable} ${archivo.variable} ${publicSans.variable} ${plexMono.variable} antialiased flex min-h-screen flex-col`}
        >
          <a
            href="#main"
            className="sr-only z-60 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
          >
            Skip to content
          </a>
          <ConfirmProvider>
            <NavBar />
            <ToastContainer
              position="bottom-center"
              theme="light"
              autoClose={2600}
              hideProgressBar
              closeOnClick
              newestOnTop
              limit={3}
            />
            <main id="main" className="flex-1">{children}</main>
            <Footer />
          </ConfirmProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
