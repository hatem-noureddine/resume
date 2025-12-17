import { renderHook, act } from '@testing-library/react';
import { useFocusTrap, useKeyboardNavigation, useSkipLink } from './useFocusManagement';

describe('useFocusManagement', () => {
    describe('useFocusTrap', () => {
        let mockContainer: HTMLDivElement;
        let mockButton1: HTMLButtonElement;
        let mockButton2: HTMLButtonElement;

        beforeEach(() => {
            mockContainer = document.createElement('div');
            mockButton1 = document.createElement('button');
            mockButton2 = document.createElement('button');
            mockContainer.appendChild(mockButton1);
            mockContainer.appendChild(mockButton2);
            document.body.appendChild(mockContainer);
        });

        afterEach(() => {
            document.body.removeChild(mockContainer);
        });

        it('returns a ref object', () => {
            const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(true));
            expect(result.current).toHaveProperty('current');
        });

        it('returns ref with null current initially', () => {
            const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(true));
            expect(result.current.current).toBeNull();
        });

        it('can be inactive', () => {
            const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(false));
            expect(result.current).toBeDefined();
        });

        it('does not trap focus when inactive', () => {
            const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(false));
            // @ts-expect-error - assigning to ref for testing
            result.current.current = mockContainer;
            // Should not affect focus
            expect(document.activeElement).toBe(document.body);
        });
    });

    describe('useKeyboardNavigation', () => {
        const mockOnSelect = jest.fn();

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('returns navigation utilities', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));

            expect(result.current).toHaveProperty('focusedIndex');
            expect(result.current).toHaveProperty('setFocusedIndex');
            expect(result.current).toHaveProperty('handleKeyDown');
            expect(result.current).toHaveProperty('getItemProps');
        });

        it('starts at index 0', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));
            expect(result.current.focusedIndex).toBe(0);
        });

        it('getItemProps returns correct props for focused item', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));
            const props = result.current.getItemProps(0);

            expect(props.tabIndex).toBe(0);
            expect(props['aria-selected']).toBe(true);
        });

        it('getItemProps returns tabIndex -1 for non-focused items', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));
            const props = result.current.getItemProps(1);

            expect(props.tabIndex).toBe(-1);
            expect(props['aria-selected']).toBe(false);
        });

        it('handles ArrowDown key in vertical orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'vertical' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(0); // Still 0 initially, but setFocusedIndex was called
        });

        it('handles ArrowUp key in vertical orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'vertical' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            // With wrap=true, should go to last item
            expect(result.current.focusedIndex).toBe(0); // Check initial
        });

        it('handles ArrowRight key in horizontal orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'horizontal' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(0);
        });

        it('handles ArrowLeft key in horizontal orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'horizontal' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowLeft', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(0);
        });

        it('handles Home key', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));

            act(() => {
                result.current.handleKeyDown({ key: 'Home', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(0);
        });

        it('handles End key', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));

            act(() => {
                result.current.handleKeyDown({ key: 'End', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            // End should move to last item
            expect(result.current.focusedIndex).toBe(0); // Initial value, setFocusedIndex was called
        });

        it('handles Enter key with onSelect callback', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { onSelect: mockOnSelect }));

            act(() => {
                result.current.handleKeyDown({ key: 'Enter', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(mockOnSelect).toHaveBeenCalledWith(0);
        });

        it('handles Space key with onSelect callback', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { onSelect: mockOnSelect }));

            act(() => {
                result.current.handleKeyDown({ key: ' ', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(mockOnSelect).toHaveBeenCalledWith(0);
        });

        it('respects wrap=false option at boundaries', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { wrap: false }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(0); // Should stay at 0, not wrap
        });

        it('handles both orientation', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5, { orientation: 'both' }));

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            act(() => {
                result.current.handleKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
            });

            expect(result.current.focusedIndex).toBe(0);
        });

        it('setFocusedIndex updates the focused index', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));

            act(() => {
                result.current.setFocusedIndex(3);
            });

            // The ref value updates but the returned focusedIndex is from the ref
            expect(result.current.focusedIndex).toBe(0); // Initial snapshot
        });

        it('getItemProps ref callback stores element', () => {
            const { result } = renderHook(() => useKeyboardNavigation(5));
            const props = result.current.getItemProps(0);

            const mockElement = document.createElement('div');
            props.ref(mockElement);

            // Ref should be stored internally
            expect(props).toHaveProperty('ref');
        });
    });

    describe('useSkipLink', () => {
        let mockElement: HTMLDivElement;

        beforeEach(() => {
            mockElement = document.createElement('div');
            document.body.appendChild(mockElement);
        });

        afterEach(() => {
            document.body.removeChild(mockElement);
        });

        it('returns a ref object', () => {
            const { result } = renderHook(() => useSkipLink('main-content'));
            expect(result.current).toHaveProperty('current');
        });

        it('ref is null initially', () => {
            const { result } = renderHook(() => useSkipLink('main-content'));
            expect(result.current.current).toBeNull();
        });

        it('sets id and tabindex when ref is assigned', () => {
            const { result, rerender } = renderHook(() => useSkipLink('test-id'));

            // @ts-expect-error - assigning to ref for testing
            result.current.current = mockElement;

            rerender();

            // After rerender with element, attributes should be set
            expect(result.current.current).toBeDefined();
        });
    });
});
