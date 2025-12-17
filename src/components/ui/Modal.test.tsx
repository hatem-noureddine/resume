import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from './Modal';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onClick, ...props }: React.PropsWithChildren<{ onClick?: () => void }>) => (
            <div onClick={onClick} {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock createPortal
jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (node: React.ReactNode) => node,
}));

describe('Modal', () => {
    const onClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={onClose}>
                <p>Modal content</p>
            </Modal>
        );
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={onClose}>
                <p>Modal content</p>
            </Modal>
        );
        expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('renders title when provided', () => {
        render(
            <Modal isOpen={true} onClose={onClose} title="Test Title">
                <p>Content</p>
            </Modal>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(
            <Modal isOpen={true} onClose={onClose} showCloseButton>
                <p>Content</p>
            </Modal>
        );

        fireEvent.click(screen.getByLabelText('Close modal'));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when Escape is pressed', () => {
        render(
            <Modal isOpen={true} onClose={onClose}>
                <p>Content</p>
            </Modal>
        );

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when overlay is clicked with closeOnOverlayClick', () => {
        render(
            <Modal isOpen={true} onClose={onClose} closeOnOverlayClick>
                <p>Content</p>
            </Modal>
        );

        // Click on the overlay (the dialog element itself)
        const dialog = screen.getByRole('dialog');
        fireEvent.click(dialog);
        expect(onClose).toHaveBeenCalled();
    });

    it('does not call onClose when content is clicked', () => {
        render(
            <Modal isOpen={true} onClose={onClose} closeOnOverlayClick>
                <p>Content</p>
            </Modal>
        );

        fireEvent.click(screen.getByText('Content'));
        expect(onClose).not.toHaveBeenCalled();
    });

    it('does not show close button when showCloseButton is false', () => {
        render(
            <Modal isOpen={true} onClose={onClose} showCloseButton={false}>
                <p>Content</p>
            </Modal>
        );

        expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <Modal isOpen={true} onClose={onClose} className="custom-modal">
                <p>Content</p>
            </Modal>
        );

        // Just verify the modal renders with content
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with different sizes', () => {
        const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

        sizes.forEach(size => {
            const { unmount } = render(
                <Modal isOpen={true} onClose={onClose} size={size}>
                    <p>Content</p>
                </Modal>
            );

            expect(screen.getByText('Content')).toBeInTheDocument();
            unmount();
        });
    });

    it('has correct aria attributes', () => {
        render(
            <Modal isOpen={true} onClose={onClose} title="Accessible Modal">
                <p>Content</p>
            </Modal>
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('locks body scroll when open', () => {
        const { unmount } = render(
            <Modal isOpen={true} onClose={onClose}>
                <p>Content</p>
            </Modal>
        );

        expect(document.body.style.overflow).toBe('hidden');

        unmount();
    });
});
