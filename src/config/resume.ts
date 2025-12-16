/**
 * Resume context for the AI chatbot.
 * This structured data is used to provide context to the LLM
 * so it can answer questions about the resume owner.
 */
export const RESUME_CONTEXT = {
    name: "Hatem Noureddine",
    title: "Kotlin Android Developer",
    email: "hatem.noureddine.pro@gmail.com",
    phone: "+33 6 66 88 70 79",
    location: "Paris, France",

    summary: `Experienced Android developer with expertise in Kotlin, Jetpack Compose, 
and mobile architecture patterns. Passionate about creating high-quality, 
user-centric mobile applications with clean code and modern development practices.`,

    skills: {
        mobile: [
            "Kotlin", "Jetpack Compose", "Android SDK", "Coroutines",
            "Flow", "Room DB", "Hilt/Dagger", "MVVM/MVI"
        ],
        languages: ["Kotlin", "Java", "TypeScript", "Python", "SQL"],
        web: ["React", "Next.js", "TailwindCSS", "Node.js"],
        tools: ["Git", "CI/CD", "Firebase", "REST APIs", "GraphQL", "Figma"],
        practices: ["Clean Architecture", "SOLID Principles", "Unit Testing", "Agile/Scrum"]
    },

    experience: [
        {
            title: "Senior Android Developer",
            company: "Company Name", // TODO: Update with actual company
            period: "2022 - Present",
            location: "Paris, France",
            highlights: [
                "Led Android team of 4 developers",
                "Migrated legacy app to Jetpack Compose",
                "Improved app performance by 40%",
                "Implemented CI/CD pipeline with GitHub Actions"
            ]
        },
        {
            title: "Android Developer",
            company: "Previous Company", // TODO: Update with actual company
            period: "2020 - 2022",
            location: "Paris, France",
            highlights: [
                "Developed multiple Android applications",
                "Implemented offline-first architecture",
                "Worked with RESTful APIs and GraphQL"
            ]
        }
    ],

    education: [
        {
            degree: "Computer Science", // TODO: Update with actual degree
            school: "University Name", // TODO: Update with actual school
            year: "2020",
            location: "France"
        }
    ],

    languages: [
        { language: "French", level: "Native" },
        { language: "English", level: "Fluent" },
        { language: "Arabic", level: "Native" }
    ],

    certifications: [
        // TODO: Add certifications if any
        // { name: "Google Associate Android Developer", year: "2023" }
    ],

    portfolio: {
        github: "https://github.com/hatemnoureddine",
        linkedin: "https://linkedin.com/in/hatemnoureddine",
        website: "https://resume-cb6ssf9ve-hatem-noureddines-projects.vercel.app/"
    },

    availableForHiring: true,
    availableForFreelance: true,
    preferredWorkStyle: ["Remote", "Hybrid"],

    // Fun facts or unique points for more engaging conversations
    interests: [
        "Mobile development",
        "Open source contribution",
        "Tech community involvement"
    ]
};

/**
 * System prompt for the AI chatbot
 */
export const CHATBOT_SYSTEM_PROMPT = `You are a helpful assistant for ${RESUME_CONTEXT.name}'s portfolio website.
Your role is to answer questions about ${RESUME_CONTEXT.name}'s professional background, skills, experience, and projects.

Here is the resume information you should use to answer questions:

Name: ${RESUME_CONTEXT.name}
Title: ${RESUME_CONTEXT.title}
Location: ${RESUME_CONTEXT.location}

Summary: ${RESUME_CONTEXT.summary}

Skills:
- Mobile: ${RESUME_CONTEXT.skills.mobile.join(', ')}
- Languages: ${RESUME_CONTEXT.skills.languages.join(', ')}
- Web: ${RESUME_CONTEXT.skills.web.join(', ')}
- Tools: ${RESUME_CONTEXT.skills.tools.join(', ')}
- Practices: ${RESUME_CONTEXT.skills.practices.join(', ')}

Experience:
${RESUME_CONTEXT.experience.map(exp => `- ${exp.title} at ${exp.company} (${exp.period}): ${exp.highlights.join(', ')}`).join('\n')}

Education:
${RESUME_CONTEXT.education.map(edu => `- ${edu.degree} from ${edu.school} (${edu.year})`).join('\n')}

Languages spoken: ${RESUME_CONTEXT.languages.map(l => `${l.language} (${l.level})`).join(', ')}

Available for hiring: ${RESUME_CONTEXT.availableForHiring ? 'Yes' : 'No'}
Preferred work style: ${RESUME_CONTEXT.preferredWorkStyle.join(', ')}

Guidelines:
1. Keep responses concise and professional but friendly
2. If asked about something not in the resume, politely say you don't have that information
3. If someone wants to contact ${RESUME_CONTEXT.name}, provide the email: ${RESUME_CONTEXT.email}
4. Encourage visitors to explore the portfolio for more details
5. Be enthusiastic about ${RESUME_CONTEXT.name}'s skills and experience
6. If asked about availability, mention that ${RESUME_CONTEXT.name} is ${RESUME_CONTEXT.availableForHiring ? 'open to opportunities' : 'currently not looking for new opportunities'}
`;
