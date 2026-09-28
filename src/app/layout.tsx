import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { Decorations } from "@/components/Decorations";

export const metadata: Metadata = {
  title: "הבינגו של אילה 🎂",
  description: "בינגו חגיגי ליום ההולדת הראשון של אילה",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff7ab8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800&family=Varela+Round&display=swap"
        />
      </head>
      <body className="font-sans antialiased">
        <Decorations />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
