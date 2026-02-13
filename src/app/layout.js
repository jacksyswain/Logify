import "./globals.css";
import Providers from "./providers";
import { Inter } from "next/font/google";

/* ================= Fonts ================= */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* ================= Metadata ================= */
export const metadata = {
  title: "Logify — Maintenance Tracking System",
  description:
    "Logify is a modern maintenance tracking platform to log issues, attach visual proof, and manage resolutions with clarity.",
  authors: [{ name: "Jyoti Prakash Swain (JPS)" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className="
          min-h-screen
          bg-slate-50
          text-slate-900
          antialiased
          selection:bg-indigo-600
          selection:text-white
        "
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
