import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Container } from "@/components/ui/Container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech Career Guidance",
  description: "Empowering diverse individuals with clear pathways into technology careers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Container>
                {children}
              </Container>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}