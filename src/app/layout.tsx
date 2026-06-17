import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Side Projects",
  description: "Tracker simples de side projects e suas tarefas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-muted/40">
        <div className="h-1 w-full bg-primary" />
        <header className="border-b bg-background">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-9 place-content-center rounded-lg bg-primary font-bold text-primary-foreground">
                SP
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-itau-azul dark:text-foreground">
                  Side Projects
                </span>
                <span className="text-xs text-muted-foreground">
                  Suas ideias e tarefas
                </span>
              </span>
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
