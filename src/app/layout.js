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
