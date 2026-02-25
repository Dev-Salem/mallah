'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '../schemas';
import { resetPasswordAction } from '../actions/resetPasswordAction';
import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';

export function ResetPasswordForm() {
    const t = useTranslations('ResetPassword');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(values: ResetPasswordFormValues) {
        setError(null);
        startTransition(async () => {
            const result = await resetPasswordAction(values);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setSuccess(true);
            }
        });
    }

    if (success) {
        return (
            <div className="space-y-6 text-center py-4">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 border border-primary/20 mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                        {t('successTitle')}
                    </h3>
                    <p className="text-[11px] font-mono text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        {t('successMessage')}
                    </p>
                </div>
                <div className="pt-4">
                    <Link
                        href="/login"
                        className="text-[10px] uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors font-bold underline decoration-primary/30 underline-offset-4"
                    >
                        {t('loginNow')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">
                                    {t('newPassword')}
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
                                <>
                                    <ShieldCheck className="h-4 w-4" />
                                    {t('submit')}
                                </>
                            )}
                        </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}
