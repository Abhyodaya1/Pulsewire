import type { Metadata } from "next";
import './globals.css'

export const metadata: Metadata = {
  title: 'RN Studio | Observability Dashboard',
  description: 'AI-Reasoning React Native Developer-Observability Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}