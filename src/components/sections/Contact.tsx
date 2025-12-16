"use client";

import { useForm } from '@formspree/react';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
    Mail,
    MapPin,
    Phone,
    User,
    MessageSquare,
    Send,
    Loader2,
    FileText
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Toast } from "@/components/ui/Toast";

// Social icons
const GithubIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2.67-5-2.67" /></svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);



import { SITE_CONFIG } from "@/config/site";

/**
 * Contact Section Component
 * Displays contact information and a functional contact form.
 * Form submission uses `mailto:` protocolimport { useForm, ValidationError } from '@formspree/react';
 */
export function Contact() {
    const { t } = useLanguage();
    const { contact } = t;
    const prefersReducedMotion = usePrefersReducedMotion();

    const [state, handleSubmit] = useForm(SITE_CONFIG.formspree.contactFormId);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (state.succeeded) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowToast(true);
            const form = document.querySelector('form') as HTMLFormElement;
            if (form) form.reset();
        }
    }, [state.succeeded]);

    const socialLinks = [
        { icon: GithubIcon, href: SITE_CONFIG.links.github, label: "GitHub" },
        { icon: LinkedinIcon, href: SITE_CONFIG.links.linkedin, label: "LinkedIn" },
        { icon: TwitterIcon, href: SITE_CONFIG.links.twitter, label: "Twitter" },
    ];

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

    const animationProps = prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, x: -50 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { duration: 0.5 }
        };

    const formAnimationProps = prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, x: 50 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { duration: 0.5 }
        };

    return (
        <>
            <Toast
                message={contact.form.success || "Email client opened! Your message is ready to send."}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <section id="contact" className="py-16 md:py-24 relative">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        title={contact.subtitle}
                        subtitle={contact.title}
                        className="mb-12 md:mb-16"
                    />

                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <motion.div
                            {...animationProps}
                            className="space-y-6 md:space-y-8"
                        >
                            <h3 className="text-2xl md:text-3xl font-bold font-outfit mb-4 md:mb-6">
                                {contact.introTitle}
                            </h3>
                            <p className="text-secondary-foreground mb-6 md:mb-8 text-base md:text-lg">
                                {contact.introDescription}
                            </p>

                            <div className="space-y-4 md:space-y-6">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold font-outfit text-foreground">{contact.addressLabel}</h4>
                                        <span className="text-secondary-foreground group-hover:text-primary transition-colors">
                                            {contact.address}
                                        </span>
                                    </div>
                                </a>

                                <a
                                    href={`mailto:${contact.email}`}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold font-outfit text-foreground">{contact.emailLabel}</h4>
                                        <span className="text-secondary-foreground group-hover:text-primary transition-colors">
                                            {contact.email}
                                        </span>
                                    </div>
                                </a>

                                <a
                                    href={`tel:${contact.phone}`}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold font-outfit text-foreground">{contact.phoneLabel}</h4>
                                        <span className="text-secondary-foreground group-hover:text-primary transition-colors">
                                            {contact.phone}
                                        </span>
                                    </div>
                                </a>
                            </div>

                            {/* Social Links */}
                            <div className="pt-6 border-t border-foreground/10">
                                <h4 className="font-medium text-sm text-secondary-foreground mb-4">
                                    {contact.followMe || "Follow me on social media"}
                                </h4>
                                <div className="flex gap-3">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all hover:scale-110"
                                            whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                                            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                                        >
                                            <social.icon size={20} />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            {...formAnimationProps}
                            className="bg-secondary/30 p-6 md:p-8 rounded-2xl border border-foreground/5"
                        >
                            <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                            <User className="w-4 h-4 text-primary" />
                                            {contact.form.name}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="John Doe"
                                                className={`w-full bg-background border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${errors.name ? "border-red-500" : "border-foreground/10"}`}
                                                onBlur={handleBlur}
                                                onChange={() => setErrors({ ...errors, name: "" })}
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="text-red-500 text-sm">{errors.name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-primary" />
                                            {contact.form.email}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                placeholder="john@example.com"
                                                className={`w-full bg-background border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${errors.email ? "border-red-500" : "border-foreground/10"}`}
                                                onBlur={handleBlur}
                                                onChange={() => setErrors({ ...errors, email: "" })}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-sm">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        {contact.form.subject}
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        placeholder="Project Inquiry"
                                        className={`w-full bg-background border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${errors.subject ? "border-red-500" : "border-foreground/10"}`}
                                        onBlur={handleBlur}
                                        onChange={() => setErrors({ ...errors, subject: "" })}
                                    />
                                    {errors.subject && (
                                        <p className="text-red-500 text-sm">{errors.subject}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                        {contact.form.message}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        placeholder="Tell me about your project..."
                                        className={`w-full bg-background border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none ${errors.message ? "border-red-500" : "border-foreground/10"}`}
                                        onBlur={handleBlur}
                                        onChange={() => setErrors({ ...errors, message: "" })}
                                    ></textarea>
                                    {errors.message && (
                                        <p className="text-red-500 text-sm">{errors.message}</p>
                                    )}
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full text-base flex items-center justify-center gap-2"
                                    disabled={state.submitting}
                                >
                                    {state.submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            {contact.form.send}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
