import "./globals.css";
import AppLayout from "@/components/AppLayout";

export const metadata = {
  title: "Pulse AI | Retail Intelligence",
  description: "Enterprise-grade autonomous retail analytics platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
