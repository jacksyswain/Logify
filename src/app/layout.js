import "./globals.css";
import Providers from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.className}
          min-h-screen
          bg-slate-50
          text-slate-900
          antialiased
          selection:bg-indigo-600
          selection:text-white
        `}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
export const metadata = {
  title: "Logify – Maintenance Tracking Platform",
  description:
    "Logify is a modern maintenance issue tracking platform for teams. Track tickets, upload evidence, manage users, and monitor workflows.",
  keywords: [
    "maintenance tracking",
    "issue tracking software",
    "internal workflow system",
    "ticket management",
  ],
};
