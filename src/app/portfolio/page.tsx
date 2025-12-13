"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import rawPortfolioData from "@/data/portfolio.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PortfolioPage() {
    const [filter, setFilter] = useState("All");
    const categories = ["All", ...Array.from(new Set(rawPortfolioData.map((item) => item.category)))];

    const filteredProjects = filter === "All"
        ? rawPortfolioData
        : rawPortfolioData.filter((item) => item.category === filter);

    return (
        <main className="min-h-screen pb-20">
            <Header />

            <section className="pt-32 pb-12 container mx-auto px-4">
                <div className="mb-12">
                    <Button variant="ghost" asChild className="mb-8 hover:bg-transparent pl-0 hover:text-primary">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft size={20} />
                            Back to Home
                        </Link>
                    </Button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-6">All Projects</h1>
                        <p className="text-secondary-foreground max-w-2xl mx-auto">
                            Explore my complete portfolio of projects across development, design, and mobile apps.
                        </p>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat
                                ? "bg-primary text-white"
                                : "bg-secondary text-secondary-foreground hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="group relative overflow-hidden rounded-2xl aspect-4/3 bg-secondary/20"
                            >
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-300 text-sm mb-1">{project.category}</p>
                                                <h3 className="text-xl font-bold font-outfit text-white">{project.title}</h3>
                                            </div>
                                            <a
                                                href={project.link}
                                                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
                                            >
                                                <ArrowUpRight size={20} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
