'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface ContactFormProps {
    onSubmit?: (data: ContactFormData) => Promise<void>;
    formspreeId?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Contact form component that can be used with Formspree or custom submission handler.
 * 
 * Usage with Formspree:
 * ```tsx
 * <ContactForm formspreeId="your-form-id" />
 * ```
 * 
 * Usage with custom handler:
 * ```tsx
 * <ContactForm onSubmit={async (data) => { await sendEmail(data); }} />
 * ```
 */
export function ContactForm({ onSubmit, formspreeId }: Readonly<ContactFormProps>) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            if (onSubmit) {
                // Custom submission handler
                await onSubmit(formData);
            } else if (formspreeId) {
                // Formspree submission
                const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }
            } else {
                throw new Error('No submission handler configured');
            }

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-secondary/30 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-foreground/40";

    return (
        <section id="contact" className="py-16">
            <div className="container mx-auto max-w-2xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold font-outfit text-center mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-secondary-foreground text-center mb-8">
                        Have a question or want to work together? Send me a message!
                    </p>

                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center py-12 bg-green-500/10 rounded-2xl border border-green-500/20"
                            >
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-green-500 mb-2">
                                    Message Sent!
                                </h3>
                                <p className="text-secondary-foreground">
                                    {"Thanks for reaching out. I'll get back to you soon."}
                                </p>
                                <Button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6"
                                    variant="outline"
                                >
                                    Send Another Message
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className={inputClasses}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className={inputClasses}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className={`${inputClasses} resize-none`}
                                        placeholder="Your message..."
                                    />
                                </div>

                                {status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl"
                                    >
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <span>{errorMessage || 'Failed to send message. Please try again.'}</span>
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    withHaptic
                                    disabled={status === 'submitting'}
                                    className="w-full md:w-auto"
                                >
                                    {status === 'submitting' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
