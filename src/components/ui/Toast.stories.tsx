import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toast } from './Toast';
import { Button } from './Button';

const meta: Meta<typeof Toast> = {
    title: 'UI/Toast',
    component: Toast,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Toast notification component for displaying messages.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['success', 'error', 'info'],
            description: 'The type of toast notification',
        },
        message: {
            control: 'text',
            description: 'The message to display',
        },
        isVisible: {
            control: 'boolean',
            description: 'Whether the toast is visible',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
    args: {
        message: 'Operation completed successfully!',
        type: 'success',
        isVisible: true,
        onClose: () => { },
    },
};

export const Error: Story = {
    args: {
        message: 'Something went wrong. Please try again.',
        type: 'error',
        isVisible: true,
        onClose: () => { },
    },
};

export const Info: Story = {
    args: {
        message: 'Here is some useful information.',
        type: 'info',
        isVisible: true,
        onClose: () => { },
    },
};

// Interactive demo using React state
function ToastDemo() {
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
        visible: boolean;
    }>({ message: '', type: 'success', visible: false });

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type, visible: true });
    };

    return (
        <div className="flex flex-col gap-4">
            <Button onClick={() => showToast('Success message!', 'success')}>
                Show Success Toast
            </Button>
            <Button onClick={() => showToast('Error message!', 'error')} variant="outline">
                Show Error Toast
            </Button>
            <Button onClick={() => showToast('Info message!', 'info')} variant="secondary">
                Show Info Toast
            </Button>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
        </div>
    );
}

export const Interactive: Story = {
    render: () => <ToastDemo />,
};
