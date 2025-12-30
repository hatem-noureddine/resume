import { renderHook, act } from "@testing-library/react";
import { useRating } from "./useRating";

// Mock localStorage and Crypto
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

// Mock crypto.randomUUID
Object.defineProperty(globalThis, "crypto", {
    value: {
        randomUUID: jest.fn(() => "test-guest-uuid"),
    },
});

describe("useRating", () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    it("initializes with default values and generates guestId", () => {
        const { result } = renderHook(() => useRating("test-post"));

        expect(result.current.rating).toBe(0);
        expect(result.current.hasRated).toBe(false);
        expect(result.current.guestId).toBe("test-guest-uuid");
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            "blog-ratings-guest-id",
            "test-guest-uuid"
        );
    });

    it("uses existing guestId if present", () => {
        localStorageMock.getItem.mockReturnValueOnce("existing-guest-id");
        const { result } = renderHook(() => useRating("test-post"));

        expect(result.current.guestId).toBe("existing-guest-id");
    });

    it("sets and persists a rating with guestId", () => {
        const { result } = renderHook(() => useRating("test-post"));

        act(() => {
            result.current.setRating(4);
        });

        expect(result.current.rating).toBe(4);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            "blog-ratings-user-test-post",
            expect.stringContaining('"guestId":"test-guest-uuid"')
        );
    });

    it("respects initialRating as admin seed", () => {
        const { result } = renderHook(() => useRating("test-post", { initialRating: 4.5 }));

        expect(result.current.averageRating).toBe(4.5);
        expect(result.current.totalRatings).toBe(1);
        expect(result.current.rating).toBe(4.5); // Initial state mirrors seed
    });

    it("updates aggregate when using initialRating seed", () => {
        const { result } = renderHook(() => useRating("test-post", { initialRating: 4 }));

        act(() => {
            result.current.setRating(5);
        });

        // 4 (seed) + 5 (new) = 9 total / 2 votes
        expect(result.current.averageRating).toBe(4.5);
        expect(result.current.totalRatings).toBe(2);
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
        // Pre-populate localStorage with matching guestId
        localStorageMock.setItem(
            "blog-ratings-guest-id",
            "test-guest-uuid"
        );
        localStorageMock.setItem(
            "blog-ratings-user-existing-post",
            JSON.stringify({
                rating: 5,
                timestamp: new Date().toISOString(),
                guestId: "test-guest-uuid"
            })
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
