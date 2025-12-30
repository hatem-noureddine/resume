/**
 * Color Contrast Utilities
 * 
 * Utility functions to calculate and verify WCAG color contrast compliance.
 * Used for ensuring accessibility of text and interactive elements.
 */

/**
 * Calculate relative luminance of an RGB color.
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        const sRGB = c / 255;
        return sRGB <= 0.03928
            ? sRGB / 12.92
            : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors.
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number }
): number {
    const lum1 = getLuminance(color1.r, color1.g, color1.b);
    const lum2 = getLuminance(color2.r, color2.g, color2.b);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse hex color to RGB.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Check if contrast meets WCAG AA standards.
 * Normal text: 4.5:1
 * Large text (18px+ or 14px bold): 3:1
 */
export function meetsWcagAA(
    foreground: string,
    background: string,
    isLargeText = false
): boolean {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return false;

    const ratio = getContrastRatio(fg, bg);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standards.
 * Normal text: 7:1
 * Large text: 4.5:1
 */
export function meetsWcagAAA(
    foreground: string,
    background: string,
    isLargeText = false
): boolean {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return false;

    const ratio = getContrastRatio(fg, bg);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

// Common color pairs used in the portfolio
export const PORTFOLIO_COLORS = {
    light: {
        background: '#faf8f6',
        foreground: '#1a1a1a',
        primary: '#4F46E5',
        muted: '#6b7280',
    },
    dark: {
        background: '#0a0a0a',
        foreground: '#fafafa',
        primary: '#818cf8',
        muted: '#9ca3af',
    },
};

/**
 * Audit portfolio color combinations for WCAG compliance.
 */
export function auditPortfolioColors(): Array<{
    theme: 'light' | 'dark';
    pair: string;
    ratio: number;
    passesAA: boolean;
    passesAAA: boolean;
}> {
    const results: Array<{
        theme: 'light' | 'dark';
        pair: string;
        ratio: number;
        passesAA: boolean;
        passesAAA: boolean;
    }> = [];

    for (const theme of ['light', 'dark'] as const) {
        const colors = PORTFOLIO_COLORS[theme];

        // Text on background
        const fg = hexToRgb(colors.foreground)!;
        const bg = hexToRgb(colors.background)!;
        const textRatio = getContrastRatio(fg, bg);
        results.push({
            theme,
            pair: 'foreground/background',
            ratio: Math.round(textRatio * 100) / 100,
            passesAA: textRatio >= 4.5,
            passesAAA: textRatio >= 7,
        });

        // Primary on background
        const primary = hexToRgb(colors.primary)!;
        const primaryRatio = getContrastRatio(primary, bg);
        results.push({
            theme,
            pair: 'primary/background',
            ratio: Math.round(primaryRatio * 100) / 100,
            passesAA: primaryRatio >= 4.5,
            passesAAA: primaryRatio >= 7,
        });

        // Muted on background
        const muted = hexToRgb(colors.muted)!;
        const mutedRatio = getContrastRatio(muted, bg);
        results.push({
            theme,
            pair: 'muted/background',
            ratio: Math.round(mutedRatio * 100) / 100,
            passesAA: mutedRatio >= 4.5,
            passesAAA: mutedRatio >= 7,
        });
    }

    return results;
}
