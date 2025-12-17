import { renderHook, act } from "@testing-library/react";
import { useRating } from "./useRating";

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        get length() {
            return Object.keys(store).length;
        },
        key: jest.fn((index: number) => Object.keys(store)[index] || null),
    };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

describe("useRating", () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    it("initializes with default values when no existing rating", () => {
        const { result } = renderHook(() => useRating("test-post"));

        expect(result.current.rating).toBe(0);
        expect(result.current.hasRated).toBe(false);
        expect(result.current.averageRating).toBe(0);
        expect(result.current.totalRatings).toBe(0);
    });

    it("sets and persists a rating", () => {
        const { result } = renderHook(() => useRating("test-post"));

        act(() => {
            result.current.setRating(4);
        });

        expect(result.current.rating).toBe(4);
        expect(result.current.hasRated).toBe(true);
        expect(result.current.totalRatings).toBe(1);
        expect(result.current.averageRating).toBe(4);
        expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("clamps rating to max value", () => {
        const { result } = renderHook(() => useRating("test-post", { maxRating: 5 }));

        act(() => {
            result.current.setRating(10);
        });

        expect(result.current.rating).toBe(5);
    });

    it("clamps rating to minimum of 1", () => {
        const { result } = renderHook(() => useRating("test-post"));

        act(() => {
            result.current.setRating(0);
        });

        expect(result.current.rating).toBe(1);
    });

    it("updates existing rating without changing count", () => {
        const { result } = renderHook(() => useRating("test-post"));

        act(() => {
            result.current.setRating(3);
        });

        expect(result.current.totalRatings).toBe(1);
        expect(result.current.averageRating).toBe(3);

        act(() => {
            result.current.setRating(5);
        });

        expect(result.current.totalRatings).toBe(1);
        expect(result.current.averageRating).toBe(5);
    });

    it("resets rating correctly", () => {
        const { result } = renderHook(() => useRating("test-post"));

        act(() => {
            result.current.setRating(4);
        });

        expect(result.current.hasRated).toBe(true);

        act(() => {
            result.current.resetRating();
        });

        expect(result.current.rating).toBe(0);
        expect(result.current.hasRated).toBe(false);
        expect(result.current.totalRatings).toBe(0);
    });

    it("loads existing rating from localStorage", () => {
        // Pre-populate localStorage
        localStorageMock.setItem(
            "blog-ratings-user-existing-post",
            JSON.stringify({ rating: 5, timestamp: new Date().toISOString() })
        );
        localStorageMock.setItem(
            "blog-ratings-aggregate-existing-post",
            JSON.stringify({ sum: 15, count: 3 })
        );

        const { result } = renderHook(() => useRating("existing-post"));

        expect(result.current.rating).toBe(5);
        expect(result.current.hasRated).toBe(true);
        expect(result.current.averageRating).toBe(5);
        expect(result.current.totalRatings).toBe(3);
    });

    it("uses custom storage key", () => {
        const { result } = renderHook(() =>
            useRating("test-post", { storageKey: "custom-ratings" })
        );

        act(() => {
            result.current.setRating(3);
        });

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            "custom-ratings-user-test-post",
            expect.any(String)
        );
    });

    it("handles localStorage errors gracefully", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        localStorageMock.getItem.mockImplementationOnce(() => {
            throw new Error("Storage error");
        });

        const { result } = renderHook(() => useRating("error-post"));

        expect(result.current.rating).toBe(0);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it("handles different posts independently", () => {
        const { result: result1 } = renderHook(() => useRating("post-1"));
        const { result: result2 } = renderHook(() => useRating("post-2"));

        act(() => {
            result1.current.setRating(5);
        });

        act(() => {
            result2.current.setRating(2);
        });

        expect(result1.current.rating).toBe(5);
        expect(result2.current.rating).toBe(2);
    });
});
