import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from './ErrorBoundary';
import React from 'react';

const BuggyComponent = ({ shouldThrow = false }) => {
    if (shouldThrow) {
        throw new Error('This is a simulated crash!');
    }
    return <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500">Everything is working fine</div>;
};

const meta: Meta<typeof ErrorBoundary> = {
    title: 'UI/ErrorBoundary',
    component: ErrorBoundary,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Normal: Story = {
    args: {
        name: 'Normal Section',
        children: <BuggyComponent />,
    },
};

export const Crashed: Story = {
    args: {
        name: 'Crashed Section',
        children: <BuggyComponent shouldThrow={true} />,
    },
};

export const CustomFallback: Story = {
    args: {
        name: 'Custom Fallback',
        fallback: (
            <div className="p-8 bg-amber-500/10 border-2 border-dashed border-amber-500/30 rounded-2xl text-center">
                <h2 className="text-2xl font-bold text-amber-500 mb-2">Oops!</h2>
                <p className="text-secondary-foreground">We custom caught this one.</p>
            </div>
        ),
        children: <BuggyComponent shouldThrow={true} />,
    },
};
