"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/config/site";
import { track } from "@vercel/analytics";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function QRCodeModal({ isOpen, onClose }: Readonly<QRCodeModalProps>) {
    const qrRef = useRef<SVGSVGElement>(null);
    const [copied, setCopied] = useState(false);

    // Use the base URL from site config or current window if available
    const siteUrl = globalThis.window === undefined
        ? SITE_CONFIG.url
        : globalThis.window.location.origin;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(siteUrl);
            setCopied(true);
            track('qr_code_link_copied');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
        }
    };

    const downloadQRCode = () => {
        const svg = qrRef.current;
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = 1000;
            canvas.height = 1000;
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 50, 50, 900, 900);
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `hatem-noureddine-portfolio-qr.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
                track('qr_code_downloaded');
            }
        };

        // Modern base64 encoding
        const base64 = btoa(encodeURIComponent(svgData).replaceAll(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCodePoint(Number.parseInt(p1, 16))
        ));
        img.src = `data:image/svg+xml;base64,${base64}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-background border border-foreground/10 rounded-3xl shadow-2xl overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-foreground/5 flex justify-between items-center bg-secondary/30">
                            <div className="flex items-center gap-2">
                                <Share2 size={18} className="text-primary" />
                                <h2 className="font-bold font-outfit text-lg">Share Portfolio</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 flex flex-col items-center">
                            <div className="p-4 bg-white rounded-2xl shadow-inner mb-6 relative group transform hover:scale-105 transition-transform duration-300">
                                <QRCodeSVG
                                    id="qr-code-svg"
                                    ref={qrRef}
                                    value={siteUrl}
                                    size={200}
                                    level="H"
                                    imageSettings={{
                                        src: "/favicon.ico",
                                        x: undefined,
                                        y: undefined,
                                        height: 40,
                                        width: 40,
                                        excavate: true,
                                    }}
                                />
                            </div>

                            <p className="text-sm text-secondary-foreground text-center mb-6 px-4">
                                Scan this QR code to view my portfolio on your mobile device.
                            </p>

                            <div className="grid grid-cols-2 gap-3 w-full">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyLink}
                                    className="gap-2 rounded-xl"
                                >
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={downloadQRCode}
                                    className="gap-2 rounded-xl"
                                >
                                    <Download size={16} />
                                    <span>Save QR</span>
                                </Button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-secondary/20 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-secondary-foreground/60 font-medium">
                                {siteUrl}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
