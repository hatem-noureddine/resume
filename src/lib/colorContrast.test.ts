import {
    getLuminance,
    getContrastRatio,
    hexToRgb,
    meetsWcagAA,
    meetsWcagAAA,
    auditPortfolioColors,
} from './colorContrast';

describe('colorContrast', () => {
    describe('getLuminance', () => {
        it('returns 0 for black', () => {
            expect(getLuminance(0, 0, 0)).toBeCloseTo(0);
        });

        it('returns 1 for white', () => {
            expect(getLuminance(255, 255, 255)).toBeCloseTo(1);
        });

        it('returns correct luminance for red', () => {
            expect(getLuminance(255, 0, 0)).toBeCloseTo(0.2126);
        });

        it('returns correct luminance for green', () => {
            expect(getLuminance(0, 255, 0)).toBeCloseTo(0.7152);
        });
    });

    describe('getContrastRatio', () => {
        it('returns 21:1 for black on white', () => {
            const ratio = getContrastRatio(
                { r: 0, g: 0, b: 0 },
                { r: 255, g: 255, b: 255 }
            );
            expect(ratio).toBeCloseTo(21, 0);
        });

        it('returns 1:1 for same colors', () => {
            const ratio = getContrastRatio(
                { r: 128, g: 128, b: 128 },
                { r: 128, g: 128, b: 128 }
            );
            expect(ratio).toBeCloseTo(1, 1);
        });
    });

    describe('hexToRgb', () => {
        it('parses hex color correctly', () => {
            expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
            expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
            expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
        });

        it('parses without hash', () => {
            expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 });
        });

        it('returns null for invalid hex', () => {
            expect(hexToRgb('invalid')).toBeNull();
            expect(hexToRgb('#gg0000')).toBeNull();
        });
    });

    describe('meetsWcagAA', () => {
        it('returns true for black on white (normal text)', () => {
            expect(meetsWcagAA('#000000', '#ffffff')).toBe(true);
        });

        it('returns false for low contrast', () => {
            expect(meetsWcagAA('#aaaaaa', '#ffffff')).toBe(false);
        });

        it('uses 3:1 ratio for large text', () => {
            expect(meetsWcagAA('#767676', '#ffffff', true)).toBe(true);
        });

        it('returns false for invalid colors', () => {
            expect(meetsWcagAA('invalid', '#ffffff')).toBe(false);
        });
    });

    describe('meetsWcagAAA', () => {
        it('returns true for black on white (normal text)', () => {
            expect(meetsWcagAAA('#000000', '#ffffff')).toBe(true);
        });

        it('returns false for 4.5:1 contrast on normal text', () => {
            // #767676 on white is ~4.5:1, passes AA but not AAA for normal text
            expect(meetsWcagAAA('#767676', '#ffffff')).toBe(false);
        });

        it('returns true for 4.5:1 on large text (AAA standard)', () => {
            expect(meetsWcagAAA('#767676', '#ffffff', true)).toBe(true);
        });
    });

    describe('auditPortfolioColors', () => {
        it('returns results for both themes', () => {
            const results = auditPortfolioColors();
            expect(results.length).toBeGreaterThan(0);

            const lightResults = results.filter(r => r.theme === 'light');
            const darkResults = results.filter(r => r.theme === 'dark');

            expect(lightResults.length).toBeGreaterThan(0);
            expect(darkResults.length).toBeGreaterThan(0);
        });

        it('includes foreground/background pair', () => {
            const results = auditPortfolioColors();
            const fgBgResults = results.filter(r => r.pair === 'foreground/background');
            expect(fgBgResults.length).toBe(2); // One for each theme
        });

        it('all foreground/background pairs pass WCAG AA', () => {
            const results = auditPortfolioColors();
            const fgBgResults = results.filter(r => r.pair === 'foreground/background');
            expect(fgBgResults.every(r => r.passesAA)).toBe(true);
        });
    });
});
