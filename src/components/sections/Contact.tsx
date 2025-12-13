"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Contact Section Component
 * Displays contact information and a functional contact form.
 * Form submission uses `mailto:` protocol to open the user's email client.
 */
export function Contact() {
    const { t } = useLanguage();
    const { contact } = t;

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let error = "";

        if (!value.trim()) {
            error = contact.form.validation.required;
        } else if (name === "email" && !validateEmail(value)) {
            error = contact.form.validation.emailInvalid;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        // Validate all fields
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = contact.form.validation.required;
        if (!subject.trim()) newErrors.subject = contact.form.validation.required;
        if (!message.trim()) newErrors.message = contact.form.validation.required;
        if (!email.trim()) {
            newErrors.email = contact.form.validation.required;
        } else if (!validateEmail(email)) {
            newErrors.email = contact.form.validation.emailInvalid;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        window.location.href = mailtoLink;
    };

    return (
        <section id="contact" className="py-24 relative">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title={contact.subtitle}
                    subtitle={contact.title}
                    className="mb-16"
                />

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <h3 className="text-3xl font-bold font-outfit mb-6">
                            {contact.introTitle}
                        </h3>
                        <p className="text-secondary-foreground mb-8 text-lg">
                            {contact.introDescription}
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold font-outfit text-foreground">{contact.addressLabel}</h4>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-secondary-foreground hover:text-primary transition-colors"
                                    >
                                        {contact.address}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold font-outfit text-foreground">{contact.emailLabel}</h4>
                                    <a href={`mailto:${contact.email} `} className="text-secondary-foreground hover:text-primary transition-colors">{contact.email}</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold font-outfit text-foreground">{contact.phoneLabel}</h4>
                                    <a href={`tel:${contact.phone} `} className="text-secondary-foreground hover:text-primary transition-colors">{contact.phone}</a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-secondary/30 p-8 rounded-2xl border border-foreground/5"
                    >
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">{contact.form.name}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="John Doe"
                                        className={`w-full bg-background border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors ${errors.name ? "border-red-500" : "border-foreground/10"}`}
                                        onBlur={handleBlur}
                                        onChange={() => setErrors({ ...errors, name: "" })}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">{contact.form.email}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        placeholder="john@example.com"
                                        className={`w-full bg-background border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors ${errors.email ? "border-red-500" : "border-foreground/10"}`}
                                        onBlur={handleBlur}
                                        onChange={() => setErrors({ ...errors, email: "" })}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium">{contact.form.subject}</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    placeholder="Project Inquiry"
                                    className={`w-full bg-background border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors ${errors.subject ? "border-red-500" : "border-foreground/10"}`}
                                    onBlur={handleBlur}
                                    onChange={() => setErrors({ ...errors, subject: "" })}
                                />
                                {errors.subject && (
                                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">{contact.form.message}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={6}
                                    placeholder="Tell me about your project..."
                                    className={`w-full bg-background border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none ${errors.message ? "border-red-500" : "border-foreground/10"}`}
                                    onBlur={handleBlur}
                                    onChange={() => setErrors({ ...errors, message: "" })}
                                ></textarea>
                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                )}
                            </div>

                            <Button size="lg" className="w-full text-base">
                                {contact.form.send}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
