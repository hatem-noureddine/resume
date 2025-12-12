"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Contact() {
    const { t } = useLanguage();
    const { contact } = t;

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
                                    <p className="text-secondary-foreground">{contact.address}</p>
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
                        className="bg-secondary/30 p-8 rounded-2xl border border-white/5"
                    >
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">{contact.form.name}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">{contact.form.email}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="john@example.com"
                                        className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium">{contact.form.subject}</label>
                                <input
                                    type="text"
                                    id="subject"
                                    placeholder="Project Inquiry"
                                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">{contact.form.message}</label>
                                <textarea
                                    id="message"
                                    rows={6}
                                    placeholder="Tell me about your project..."
                                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                                ></textarea>
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
