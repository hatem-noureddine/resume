"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Volume2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Web Speech API type declarations
interface SpeechRecognitionType extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognitionType, ev: Event) => void) | null;
    onresult: ((this: SpeechRecognitionType, ev: SpeechRecognitionEventType) => void) | null;
    onerror: ((this: SpeechRecognitionType, ev: SpeechRecognitionErrorEventType) => void) | null;
    onend: ((this: SpeechRecognitionType, ev: Event) => void) | null;
}

interface SpeechRecognitionEventType extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventType extends Event {
    error: string;
    message: string;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

declare global {
    interface Window {
        SpeechRecognition?: new () => SpeechRecognitionType;
        webkitSpeechRecognition?: new () => SpeechRecognitionType;
    }
}

interface VoiceCommand {
    command: string | RegExp;
    action: () => void;
    description: string;
}

interface VoiceNavigationProps {
    readonly className?: string;
}

// Check if SpeechRecognition is supported
const getSpeechRecognition = (): (new () => SpeechRecognitionType) | null => {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
};

/**
 * Premium Voice navigation component using Web Speech API.
 * Integrated design with high-end glassmorphism and spring animations.
 */
export function VoiceNavigation({ className = "" }: VoiceNavigationProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [feedback, setFeedback] = useState("");
    const [showHelp, setShowHelp] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionType | null>(null);
    const { direction } = useLanguage();

    // Show on scroll like accessibility
    useEffect(() => {
        const handleScroll = () => {
            const shouldShow = window.scrollY > 300;
            setIsVisible(shouldShow);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
        setTranscript("");
        setFeedback("");
    }, []);

    // Define voice commands
    const commands: VoiceCommand[] = useMemo(() => [
        {
            command: /scroll (down|up)/i,
            action: () => {
                const match = transcript.match(/scroll (down|up)/i);
                if (match) {
                    const dir = match[1].toLowerCase();
                    window.scrollBy({
                        top: dir === 'down' ? 400 : -400,
                        behavior: 'smooth'
                    });
                    setFeedback(`Scrolling ${dir}`);
                }
            },
            description: "Say 'scroll down' or 'scroll up'"
        },
        {
            command: /go to (hero|home|top|services|experience|skills|portfolio|blog|contact)/i,
            action: () => {
                const match = transcript.match(/go to (\w+)/i);
                if (match) {
                    const section = match[1].toLowerCase();
                    const sectionMap: Record<string, string> = {
                        hero: 'hero',
                        home: 'hero',
                        top: 'hero',
                        services: 'services',
                        experience: 'experience',
                        skills: 'skills',
                        portfolio: 'portfolio',
                        blog: 'blog',
                        contact: 'contact'
                    };
                    const targetId = sectionMap[section];
                    if (targetId) {
                        const element = document.getElementById(targetId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            setFeedback(`Going to ${section}`);
                        }
                    }
                }
            },
            description: "Say 'go to [section]' (services, experience, etc.)"
        },
        {
            command: /(dark|light) mode/i,
            action: () => {
                const match = transcript.match(/(dark|light) mode/i);
                if (match) {
                    const mode = match[1].toLowerCase();
                    document.documentElement.classList.remove('dark', 'light');
                    document.documentElement.classList.add(mode);
                    localStorage.setItem('theme', mode);
                    setFeedback(`Switching to ${mode} mode`);
                }
            },
            description: "Say 'dark mode' or 'light mode'"
        },
        {
            command: /open (blog|portfolio)/i,
            action: () => {
                const match = transcript.match(/open (\w+)/i);
                if (match) {
                    const page = match[1].toLowerCase();
                    if (page === 'blog' || page === 'portfolio') {
                        window.location.href = `/${page}`;
                        setFeedback(`Opening ${page}`);
                    }
                }
            },
            description: "Say 'open blog' or 'open portfolio'"
        },
        {
            command: /stop listening/i,
            action: () => {
                stopListening();
                setFeedback("Voice control stopped");
            },
            description: "Say 'stop listening' to deactivate"
        }
    ], [transcript, stopListening]);

    const processCommand = useCallback((text: string) => {
        const lowerText = text.toLowerCase();

        for (const cmd of commands) {
            if (cmd.command instanceof RegExp) {
                if (cmd.command.test(lowerText)) {
                    cmd.action();
                    return true;
                }
            } else if (lowerText.includes(cmd.command.toString().toLowerCase())) {
                cmd.action();
                return true;
            }
        }

        setFeedback("Command not recognized");
        return false;
    }, [commands, stopListening, transcript]);

    const startListening = useCallback(() => {
        const SpeechRecognitionClass = getSpeechRecognition();
        if (!SpeechRecognitionClass) return;

        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setFeedback("Listening...");
        };

        recognition.onresult = (event: SpeechRecognitionEventType) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript = result[0].transcript;
                }
            }

            if (finalTranscript) {
                setTranscript(finalTranscript);
                processCommand(finalTranscript);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEventType) => {
            console.error('Speech recognition error:', event.error);
            if (event.error !== 'no-speech') {
                setFeedback(`Error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            // Restart if still supposed to be listening
            if (isListening && recognitionRef.current) {
                recognitionRef.current.start();
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [isListening, processCommand]);

    // Check browser support
    useEffect(() => {
        setIsSupported(getSpeechRecognition() !== null);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Clear feedback after delay
    useEffect(() => {
        if (feedback && feedback !== "Listening...") {
            const timer = setTimeout(() => {
                setFeedback(isListening ? "Listening..." : "");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [feedback, isListening]);

    if (!isSupported) {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: direction === "rtl" ? 60 : -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === "rtl" ? 60 : -60 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8,
                        delay: 0.1
                    }}
                    className={`fixed ltr:left-4 rtl:right-4 top-1/2 translate-y-[calc(50%+2.5rem)] z-40 hidden md:flex flex-col items-start gap-3 ${className}`}
                >
                    {/* Feedback Toast */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, x: direction === "rtl" ? 10 : -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: direction === "rtl" ? 10 : -10 }}
                                className="absolute ltr:left-full rtl:right-full ltr:ml-4 rtl:mr-4 bottom-1/2 translate-y-1/2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-xl shadow-2xl whitespace-nowrap z-50 backdrop-blur-md"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    {feedback}
                                </div>
                                <div className="absolute ltr:right-full rtl:left-full top-1/2 -translate-y-1/2 border-8 border-transparent ltr:border-r-foreground rtl:border-l-foreground" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Interaction Group */}
                    <div className="flex flex-col items-start gap-3">
                        <motion.button
                            onClick={isListening ? stopListening : startListening}
                            className={`
                                relative flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl
                                transition-all duration-300 overflow-hidden
                                ${isListening
                                    ? 'bg-red-500 text-white shadow-red-500/30'
                                    : 'bg-background/90 backdrop-blur-xl border border-foreground/10 text-foreground shadow-lg hover:shadow-xl hover:border-primary/30'
                                }
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={isListening ? 'Stop voice navigation' : 'Start voice navigation'}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isListening ? 'listening' : 'idle'}
                                    initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: 1.5, opacity: 0, rotate: 45 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isListening ? <MicOff size={22} strokeWidth={2.5} /> : <Mic size={22} strokeWidth={2} />}
                                </motion.div>
                            </AnimatePresence>

                            {isListening && (
                                <motion.div
                                    className="absolute inset-0 rounded-2xl border-4 border-white/30"
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            )}
                        </motion.button>

                        <motion.button
                            onClick={() => setShowHelp(!showHelp)}
                            className={`
                                flex items-center justify-center w-10 h-10 rounded-xl shadow-md transition-all
                                bg-background/90 backdrop-blur-xl border border-foreground/10 text-muted-foreground 
                                hover:text-foreground hover:border-primary/20
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Voice commands help"
                        >
                            <Volume2 size={18} />
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {showHelp && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: direction === "rtl" ? 20 : -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: direction === "rtl" ? 20 : -20 }}
                                className="absolute ltr:left-16 rtl:right-16 bottom-0 w-72 p-5 bg-background/95 backdrop-blur-2xl border border-foreground/10 rounded-2xl shadow-2xl z-40"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                            <Mic size={14} />
                                        </div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">Voice Control</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowHelp(false)}
                                        className="p-1.5 hover:bg-foreground/5 rounded-lg transition-colors"
                                    >
                                        <X size={16} className="text-muted-foreground" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {/* eslint-disable-next-line react-hooks/refs */}
                                    {commands.map((cmd, i) => (
                                        <div key={i} className="group flex items-start gap-3 p-2 rounded-xl hover:bg-foreground/5 transition-colors">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0 opacity-40 group-hover:opacity-100" />
                                            <span className="text-xs font-medium leading-relaxed">{cmd.description}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t border-foreground/5">
                                    <p className="text-[10px] text-muted-foreground text-center italic">
                                        Try saying commands naturally
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
