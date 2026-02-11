'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/lib/i18n/routing';
import {useTransition} from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onLanguageChange() {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onLanguageChange}
      disabled={isPending}
      className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-all rounded-none border border-white/5 px-3"
    >
      <Languages className="mr-2 h-3 w-3" />
      {locale === 'en' ? 'AR' : 'EN'}
    </Button>
  );
}
