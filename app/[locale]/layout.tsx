import { Inter, JetBrains_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { getMessages, getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata = {
  title: "Mallah | Tactical Career Navigation",
  description: "Bridge the gap between graduation and employment with mission-critical roadmaps.",
};

import { ThemeProvider } from "@/components/shared/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const isArabic = locale.startsWith('ar');

  return (
    <html lang={locale} className={`${inter.variable} ${mono.variable} ${ibmPlexArabic.variable}`} dir={isArabic ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
