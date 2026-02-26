import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "./MainLayout";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "EmpathIQ — Emotion-Aware AI Sanctuary",
  description: "Next-generation mental wellness with clinical AI coaching and proactive companionship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AppProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </AppProvider>
      </body>
    </html>
  );
}
