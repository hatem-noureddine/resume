import { haptic } from './haptic';

describe('haptic utility', () => {
    const originalNavigator = globalThis.navigator;
    const originalMatchMedia = globalThis.matchMedia;
    const mockVibrate = jest.fn();
    const mockMatchMedia = jest.fn();

    beforeAll(() => {
        Object.defineProperty(globalThis, "navigator", {
            value: {
                vibrate: mockVibrate,
            },
            writable: true,
        });

        Object.defineProperty(globalThis, "matchMedia", {
            value: mockMatchMedia,
            writable: true,
        });

        // Default mock for matchMedia (no reduced motion)
        mockMatchMedia.mockReturnValue({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        });
    });

    afterAll(() => {
        globalThis.navigator = originalNavigator;
        globalThis.matchMedia = originalMatchMedia;
    });

    beforeEach(() => {
        mockVibrate.mockClear();
        mockMatchMedia.mockClear();
        // Reset to no reduced motion
        mockMatchMedia.mockReturnValue({
            matches: false,
        });
    });

    it('should report supported status correctly', () => {
        expect(haptic.isSupported()).toBe(true);

        const tempNavigator = globalThis.navigator;
        Object.defineProperty(globalThis, "navigator", {
            value: undefined,
            writable: true,
        });
        expect(haptic.isSupported()).toBe(false);
        globalThis.navigator = tempNavigator;
    });

    it('should vibrate with default pattern', () => {
        haptic.vibrate();
        expect(mockVibrate).toHaveBeenCalledWith(10);
    });

    it('should vibrate with custom pattern', () => {
        haptic.vibrate([50, 50, 50]);
        expect(mockVibrate).toHaveBeenCalledWith([50, 50, 50]);
    });

    it('should provide subtle feedback', () => {
        haptic.subtle();
        expect(mockVibrate).toHaveBeenCalledWith(10);
    });

    it('should provide medium feedback', () => {
        haptic.medium();
        expect(mockVibrate).toHaveBeenCalledWith(25);
    });

    it('should provide heavy feedback', () => {
        haptic.heavy();
        expect(mockVibrate).toHaveBeenCalledWith(50);
    });

    it('should provide error feedback', () => {
        haptic.error();
        expect(mockVibrate).toHaveBeenCalledWith([50, 50, 50]);
    });

    it('should not vibrate if reduced motion is preferred', () => {
        mockMatchMedia.mockReturnValue({ matches: true });
        haptic.subtle();
        expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should handle missing navigator gracefully', () => {
        // Temporarily remove navigator
        Object.defineProperty(globalThis, 'navigator', {
            value: undefined,
            writable: true,
        });

        expect(() => haptic.subtle()).not.toThrow();

        // Restore navigator
        Object.defineProperty(globalThis, 'navigator', {
            value: { vibrate: mockVibrate },
            writable: true,
        });
    });

    it('should handle vibration errors gracefully (silent fail)', () => {
        mockVibrate.mockImplementationOnce(() => {
            throw new Error('Vibration failed');
        });

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        expect(() => haptic.subtle()).not.toThrow();
        // We no longer log errors
        expect(consoleSpy).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
