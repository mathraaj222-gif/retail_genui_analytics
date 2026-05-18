import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Pulse AI | Retail Intelligence",
  description: "Enterprise-grade autonomous retail analytics platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${mono.variable} font-outfit antialiased bg-[#020617]`}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
