'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '../schemas';
import { registerAction } from '../actions/registerAction';
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

interface RegisterFormProps {
    locale: string;
}

export function RegisterForm({ locale }: RegisterFormProps) {
    const t = useTranslations('Register');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(values: RegisterFormValues) {
        setError(null);
        startTransition(async () => {
            const result = await registerAction(values, locale);
            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">
                                        {t('firstName')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ahmed"
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
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">
                                        {t('lastName')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Al-Mallah"
                                            className="glass border-primary/20 rounded-none focus-visible:ring-primary/50 text-white placeholder:text-white/20"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-400 font-mono" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">
                                    {t('email')}
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
                                    {t('password')}
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

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">
                                    {t('confirmPassword')}
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
                                t('submit')
                            )}
                        </span>
                    </Button>
                </form>
            </Form>

            <div className="text-center pt-4">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                    {t('haveAccount')}{' '}
                    <Link
                        href="/login"
                        className="text-primary hover:text-primary/80 transition-colors font-black ml-1 underline decoration-primary/30 underline-offset-4"
                    >
                        {t('loginNow')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
