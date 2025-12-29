import { haptic } from './haptic';

describe('haptic utility', () => {
    const originalNavigator = globalThis.navigator;
    const mockVibrate = jest.fn();

    beforeAll(() => {
        Object.defineProperty(globalThis, 'navigator', {
            value: {
                vibrate: mockVibrate,
            },
            writable: true,
        });
    });

    afterAll(() => {
        globalThis.navigator = originalNavigator;
    });

    beforeEach(() => {
        mockVibrate.mockClear();
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

    it('should handle vibration errors gracefully', () => {
        mockVibrate.mockImplementationOnce(() => {
            throw new Error('Vibration failed');
        });

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        expect(() => haptic.subtle()).not.toThrow();
        expect(consoleSpy).toHaveBeenCalledWith('Haptic feedback failed:', expect.any(Error));

        consoleSpy.mockRestore();
    });
});
