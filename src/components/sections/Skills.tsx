"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function Skills() {
    const { t } = useLanguage();
    const { skills } = t;

    const skillsData = [
        {
            category: skills.categories.frontend,
            items: [
                { name: "React / Next.js", percentage: 95 },
                { name: "TypeScript", percentage: 90 },
                { name: "Tailwind CSS", percentage: 95 },
                { name: "Framer Motion", percentage: 85 },
            ],
        },
        {
            category: skills.categories.backend,
            items: [
                { name: "Node.js", percentage: 80 },
                { name: "Python / Django", percentage: 75 },
                { name: "PostgreSQL", percentage: 70 },
                { name: "GraphQL", percentage: 65 },
            ],
        },
    ];

    return (
        <section id="skills" className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {skills.title.split(" ")[0]} <span className="text-primary">{skills.title.split(" ").slice(1).join(" ")}</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {skills.description}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {skillsData.map((category, catIndex) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, x: catIndex === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-secondary/20 p-8 rounded-2xl border border-white/5"
                        >
                            <h3 className="text-2xl font-bold mb-8 text-primary">
                                {category.category}
                            </h3>
                            <div className="space-y-6">
                                {category.items.map((skill, index) => (
                                    <div key={skill.name}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium">{skill.name}</span>
                                            <span className="text-muted-foreground">{skill.percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.percentage}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                                className="h-full bg-primary rounded-full relative"
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
