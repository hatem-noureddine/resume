import { savePerformanceSnapshot, getPerformanceHistory, clearPerformanceHistory, getHistoryForPage, setBaseline, clearBaseline } from './performance-store';

describe('performance-store', () => {
    const mockLocalStorage = (() => {
        let store: Record<string, string> = {};
        return {
            getItem: jest.fn((key: string) => store[key] || null),
            setItem: jest.fn((key: string, value: string) => {
                store[key] = value.toString();
            }),
            removeItem: jest.fn((key: string) => {
                delete store[key];
            }),
            clear: jest.fn(() => {
                store = {};
            }),
        };
    })();

    beforeAll(() => {
        Object.defineProperty(globalThis, 'window', {
            value: {
                localStorage: mockLocalStorage,
            },
            writable: true,
        });
    });

    beforeEach(() => {
        mockLocalStorage.clear();
        jest.clearAllMocks();
    });

    it('should save performance snapshot', () => {
        savePerformanceSnapshot('/home', { FCP: 100 }, 90);

        const history = getPerformanceHistory();
        expect(history['/home']).toBeDefined();
        expect(history['/home'].metrics.FCP).toHaveLength(1);
        expect(history['/home'].metrics.FCP[0].value).toBe(100);
        expect(history['/home'].overallScoreHistory).toHaveLength(1);
        expect(history['/home'].overallScoreHistory[0].value).toBe(90);
    });

    it('should handle multiple entries and limit to 50', () => {
        for (let i = 0; i < 60; i++) {
            savePerformanceSnapshot('/home', { FCP: i }, i);
        }

        const history = getHistoryForPage('/home');
        expect(history?.metrics.FCP).toHaveLength(50);
        expect(history?.metrics.FCP[49].value).toBe(59); // Last one
        expect(history?.overallScoreHistory).toHaveLength(50);
    });

    it('should retrieve history', () => {
        mockLocalStorage.setItem('vitals_history', JSON.stringify({
            '/test': { page: '/test', metrics: {}, overallScoreHistory: [] }
        }));

        const history = getPerformanceHistory();
        expect(history['/test']).toBeDefined();
    });

    it('should clear history', () => {
        savePerformanceSnapshot('/home', { FCP: 100 }, null);
        clearPerformanceHistory();
        const history = getPerformanceHistory();
        expect(Object.keys(history)).toHaveLength(0);
    });

    it('should set and clear baseline', () => {
        savePerformanceSnapshot('/home', { FCP: 100 }, null);

        const timestamp = 1234567890;
        setBaseline('/home', timestamp);

        let history = getHistoryForPage('/home');
        expect(history?.baselineTimestamp).toBe(timestamp);

        clearBaseline('/home');
        history = getHistoryForPage('/home');
        expect(history?.baselineTimestamp).toBeUndefined();
    });

    it('should handle missing window gracefully', () => {
        const originalWindow = globalThis.window;
        Object.defineProperty(globalThis, 'window', { value: undefined, writable: true });

        expect(() => savePerformanceSnapshot('/home', {}, null)).not.toThrow();
        expect(getPerformanceHistory()).toEqual({});
        expect(() => clearPerformanceHistory()).not.toThrow();

        Object.defineProperty(globalThis, 'window', { value: originalWindow, writable: true });
    });
});
