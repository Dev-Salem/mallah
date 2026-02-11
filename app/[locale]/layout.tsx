import { Inter, JetBrains_Mono, Alexandria } from "next/font/google";
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

const alexandria = Alexandria({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-alexandria",
  display: "swap",
});

export const metadata = {
  title: "Mallah | Tactical Career Navigation",
  description: "Bridge the gap between graduation and employment with mission-critical roadmaps.",
};

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
    <html lang={locale} className="dark" dir={isArabic ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${mono.variable} ${alexandria.variable} font-sans antialiased bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
