import { renderHook } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';
import { RefObject } from 'react';

// Helper to create a container with focusable elements
function createContainerWithFocusables() {
    const container = document.createElement('div');
    container.innerHTML = `
        <button id="btn1">Button 1</button>
        <input id="input1" type="text" />
        <a id="link1" href="#">Link</a>
        <button id="btn2">Button 2</button>
    `;
    container.tabIndex = -1;
    document.body.appendChild(container);
    return container;
}

describe('useFocusTrap', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = createContainerWithFocusables();
    });

    afterEach(() => {
        container.remove();
        jest.clearAllMocks();
    });

    it('focuses the first focusable element when activated', () => {
        const containerRef = { current: container } as RefObject<HTMLElement>;

        renderHook(() => useFocusTrap(containerRef, true));

        expect(document.activeElement?.id).toBe('btn1');
    });

    it('focuses the initial focus ref when provided', () => {
        const containerRef = { current: container } as RefObject<HTMLElement>;
        const input = container.querySelector('#input1') as HTMLElement;
        const initialFocusRef = { current: input } as RefObject<HTMLElement>;

        renderHook(() =>
            useFocusTrap(containerRef, true, { initialFocusRef })
        );

        expect(document.activeElement?.id).toBe('input1');
    });

    it('traps Tab at the end to cycle to the first element', () => {
        const containerRef = { current: container } as RefObject<HTMLElement>;
        const lastBtn = container.querySelector('#btn2') as HTMLElement;

        renderHook(() => useFocusTrap(containerRef, true));

        // Focus the last element
        lastBtn.focus();
        expect(document.activeElement?.id).toBe('btn2');

        // Simulate Tab key
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        document.dispatchEvent(event);

        expect(document.activeElement?.id).toBe('btn1');
    });

    it('traps Shift+Tab at the start to cycle to the last element', () => {
        const containerRef = { current: container } as RefObject<HTMLElement>;
        const firstBtn = container.querySelector('#btn1') as HTMLElement;

        renderHook(() => useFocusTrap(containerRef, true));

        // Focus the first element
        firstBtn.focus();
        expect(document.activeElement?.id).toBe('btn1');

        // Simulate Shift+Tab key
        const event = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true
        });
        Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
        document.dispatchEvent(event);

        expect(document.activeElement?.id).toBe('btn2');
    });

    it('does not trap focus when inactive', () => {
        const containerRef = { current: container } as RefObject<HTMLElement>;
        const outsideBtn = document.createElement('button');
        outsideBtn.id = 'outside';
        document.body.appendChild(outsideBtn);
        outsideBtn.focus();

        renderHook(() => useFocusTrap(containerRef, false));

        expect(document.activeElement?.id).toBe('outside');
        outsideBtn.remove();
    });
});
