import type { Meta, StoryObj } from '@storybook/react';
import { Toast, showToast } from './Toast';
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
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
    args: {
        message: 'Operation completed successfully!',
        type: 'success',
    },
};

export const Error: Story = {
    args: {
        message: 'Something went wrong. Please try again.',
        type: 'error',
    },
};

export const Info: Story = {
    args: {
        message: 'Here is some useful information.',
        type: 'info',
    },
};

export const Interactive: Story = {
    render: () => (
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
        </div>
    ),
};
