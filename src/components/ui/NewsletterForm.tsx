'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NewsletterFormProps {
    formspreeId?: string;
    buttondownId?: string;
    onSubmit?: (email: string) => Promise<void>;
    title?: string;
    description?: string;
    successMessage?: string;
    className?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Newsletter subscription form that supports Formspree, Buttondown, or custom handlers.
 * 
 * Usage:
 * ```tsx
 * // With Buttondown
 * <NewsletterForm buttondownId="your-username" />
 * 
 * // With Formspree
 * <NewsletterForm formspreeId="your-form-id" />
 * 
 * // With custom handler
 * <NewsletterForm onSubmit={async (email) => await subscribe(email)} />
 * ```
 */
export function NewsletterForm({
    formspreeId,
    buttondownId,
    onSubmit,
    title = "Subscribe to my newsletter",
    description = "Get notified about new posts and updates.",
    successMessage = "Thanks for subscribing!",
    className = '',
}: Readonly<NewsletterFormProps>) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email?.includes('@')) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');

        try {
            if (onSubmit) {
                await onSubmit(email);
            } else if (buttondownId) {
                const response = await fetch(`https://api.buttondown.email/v1/subscribers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${buttondownId}`,
                    },
                    body: JSON.stringify({ email }),
                });
                if (!response.ok) throw new Error('Subscription failed');
            } else if (formspreeId) {
                const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
                if (!response.ok) throw new Error('Subscription failed');
            } else {
                // Default to local API
                const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    throw new Error(error.error || 'Subscription failed');
                }
            }

            setStatus('success');
            setEmail('');
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Subscription failed');
        }
    };

    return (
        <section className={`py-12 ${className}`}>
            <motion.div
                className="max-w-xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                </div>

                <h3 className="text-2xl font-bold font-outfit mb-2">{title}</h3>
                <p className="text-secondary-foreground mb-6">{description}</p>

                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center gap-2 text-green-500 bg-green-500/10 p-4 rounded-xl"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span>{successMessage}</span>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <label htmlFor="newsletter-email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="newsletter-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 bg-secondary/30 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-foreground/40"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="shrink-0"
                        >
                            {status === 'submitting' ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Subscribing...
                                </>
                            ) : (
                                'Subscribe'
                            )}
                        </Button>
                    </form>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 text-red-500 mt-3"
                    >
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errorMessage}</span>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
