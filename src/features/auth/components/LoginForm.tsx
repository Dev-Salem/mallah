'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../schemas';
import { loginAction } from '../actions/loginAction';
import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';

interface LoginFormProps {
    locale: string;
}

export function LoginForm({ locale }: LoginFormProps) {
    const t = useTranslations('Login');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    async function onSubmit(values: LoginFormValues) {
        setError(null);
        startTransition(async () => {
            const result = await loginAction(values, locale);
            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">
                                    {t('emailLabel')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="navigator@mallah.sa"
                                        className="glass border-primary/20 rounded-none focus-visible:ring-primary/50 text-white placeholder:text-white/20"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] text-red-400 font-mono" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">
                                    {t('passwordLabel')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="••••••••"
                                        className="glass border-primary/20 rounded-none focus-visible:ring-primary/50 text-white placeholder:text-white/20"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] text-red-400 font-mono" />
                            </FormItem>
                        )}
                    />

                    <div className="text-end">
                        <Link
                            href="/forgot-password"
                            className="text-[10px] text-primary/60 hover:text-primary transition-colors uppercase tracking-widest font-mono"
                        >
                            {t('forgotPassword')}
                        </Link>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 flex items-center gap-3 text-red-400 text-xs font-mono">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-[0.2em] rounded-none py-6 h-auto glow-button group relative overflow-hidden"
                        disabled={isPending}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative flex items-center justify-center gap-2">
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                t('signIn')
                            )}
                        </span>
                    </Button>
                </form>
            </Form>

            <div className="text-center pt-4">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                    {t('noAccount')}{' '}
                    <Link
                        href="/register"
                        className="text-primary hover:text-primary/80 transition-colors font-black ml-1 underline decoration-primary/30 underline-offset-4"
                    >
                        {t('registerNow')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
