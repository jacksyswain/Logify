import "./globals.css";
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
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
    "Logify is a modern maintenance tracking platform for teams to log issues, attach visual proof, and manage resolutions with clarity.",
  keywords: [
    "maintenance",
    "issue tracking",
    "log management",
    "facility management",
    "internal tools",
  ],
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
          {/* App wrapper */}
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
