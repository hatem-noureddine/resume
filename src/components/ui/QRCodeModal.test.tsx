import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QRCodeModal } from './QRCodeModal';
import { track } from '@vercel/analytics';

// Mock @vercel/analytics
jest.mock('@vercel/analytics', () => ({
    track: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock qrcode.react
const MockQRCode = React.forwardRef((props: any, ref: any) => (
    <svg {...props} ref={ref} data-testid="qr-code-svg" />
));
MockQRCode.displayName = 'QRCodeSVG';

jest.mock('qrcode.react', () => ({
    QRCodeSVG: MockQRCode,
}));

describe('QRCodeModal', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock Clipboard API
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn().mockImplementation(() => Promise.resolve()),
            },
        });

        // Mock XMLSerializer
        (globalThis as any).XMLSerializer = jest.fn().mockImplementation(() => ({
            serializeToString: jest.fn().mockReturnValue('<svg></svg>'),
        }));

        // Mock Canvas
        HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
        });
        HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue('data:image/png;base64,mock');

        // Mock Image
        (globalThis as any).Image = class {
            onload: () => void = () => { };
            src: string = '';
            constructor() {
                setTimeout(() => this.onload(), 0);
            }
        };

        // Mock URL and Origin
        delete (globalThis as any).window.location;
        (globalThis as any).window.location = {
            origin: 'https://test.com',
        };
    });

    it('renders when open', () => {
        render(<QRCodeModal isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByText('Share Portfolio')).toBeInTheDocument();
        expect(screen.getByTestId('qr-code-svg')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<QRCodeModal isOpen={false} onClose={mockOnClose} />);
        expect(screen.queryByText('Share Portfolio')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<QRCodeModal isOpen={true} onClose={mockOnClose} />);
        const closeButton = screen.getByLabelText('Close modal');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles link copying', async () => {
        render(<QRCodeModal isOpen={true} onClose={mockOnClose} />);
        const copyButton = screen.getByText('Copy Link');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://test.com');
            expect(screen.getByText('Copied!')).toBeInTheDocument();
        });

        expect(track).toHaveBeenCalledWith('qr_code_link_copied');
    });

    it('handles QR code download', async () => {
        render(<QRCodeModal isOpen={true} onClose={mockOnClose} />);
        const saveButton = screen.getByText('Save QR');

        // Mocking the click on the temporary link
        const linkClickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { });

        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(track).toHaveBeenCalledWith('qr_code_downloaded');
            expect(linkClickSpy).toHaveBeenCalled();
        });

        linkClickSpy.mockRestore();
    });
});
