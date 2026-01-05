import { renderHook, act } from '@testing-library/react';
import { useSwipe } from './useSwipe';

describe('useSwipe', () => {
    it('should call onSwipeLeft when swiping left', () => {
        const onSwipeLeft = jest.fn();
        const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

        act(() => {
            const touchStart = { targetTouches: [{ clientX: 100 }] } as any;
            result.current.onTouchStart(touchStart);

            const touchMove = { targetTouches: [{ clientX: 20 }] } as any; // Moved 80px left
            result.current.onTouchMove(touchMove);

            result.current.onTouchEnd();
        });

        expect(onSwipeLeft).toHaveBeenCalled();
    });

    it('should call onSwipeRight when swiping right', () => {
        const onSwipeRight = jest.fn();
        const { result } = renderHook(() => useSwipe({ onSwipeRight }));

        act(() => {
            const touchStart = { targetTouches: [{ clientX: 20 }] } as any;
            result.current.onTouchStart(touchStart);

            const touchMove = { targetTouches: [{ clientX: 100 }] } as any; // Moved 80px right
            result.current.onTouchMove(touchMove);

            result.current.onTouchEnd();
        });

        expect(onSwipeRight).toHaveBeenCalled();
    });

    it('should not call callbacks if swipe distance is less than minSwipeDistance', () => {
        const onSwipeLeft = jest.fn();
        const onSwipeRight = jest.fn();
        const { result } = renderHook(() =>
            useSwipe({ onSwipeLeft, onSwipeRight, minSwipeDistance: 50 })
        );

        act(() => {
            const touchStart = { targetTouches: [{ clientX: 100 }] } as any;
            result.current.onTouchStart(touchStart);

            const touchMove = { targetTouches: [{ clientX: 80 }] } as any; // Moved only 20px left
            result.current.onTouchMove(touchMove);

            result.current.onTouchEnd();
        });

        expect(onSwipeLeft).not.toHaveBeenCalled();
        expect(onSwipeRight).not.toHaveBeenCalled();
    });
});
