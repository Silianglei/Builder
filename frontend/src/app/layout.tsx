import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { RootProvider } from "@/components/providers/root-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "5am Founder - Launch Your Startup in Minutes",
  description: "The fastest way to ship your SaaS. Database, auth, payments, and AI-powered development – everything you need to go from idea to launch before sunrise.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <AuthProvider>
          <RootProvider>
            {children}
          </RootProvider>
        </AuthProvider>
      </body>
    </html>
  );
}