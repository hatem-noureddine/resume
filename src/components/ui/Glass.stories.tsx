import type { Meta, StoryObj } from '@storybook/react';
import { GlassCard, GlassPanel, GlassButton, GlassInput } from './Glass';
import React from 'react';

const meta: Meta<typeof GlassCard> = {
    title: 'UI/Glass/Card',
    component: GlassCard,
    tags: ['autodocs'],
    argTypes: {
        blur: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
        },
        border: {
            control: 'boolean',
        },
        hover: {
            control: 'boolean',
        },
        glow: {
            control: 'boolean',
        },
        shimmer: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof GlassCard>;

export const Default: Story = {
    args: {
        children: (
            <div className="space-y-2">
                <h3 className="text-xl font-bold">Glass Card</h3>
                <p>This is a standard glass card with default settings.</p>
            </div>
        ),
    },
};

export const Interactive: Story = {
    args: {
        children: (
            <div className="space-y-2">
                <h3 className="text-xl font-bold">Interactive Card</h3>
                <p>Hover me to see the glow and lift effect.</p>
            </div>
        ),
        hover: true,
        glow: true,
    },
};

export const Shimmer: Story = {
    args: {
        children: (
            <div className="space-y-2">
                <h3 className="text-xl font-bold">Shimmer Effect</h3>
                <p>This card has a subtle shimmer animation.</p>
            </div>
        ),
        shimmer: true,
    },
};

export const LargeBlur: Story = {
    args: {
        children: (
            <div className="space-y-2">
                <h3 className="text-xl font-bold">Large Blur</h3>
                <p>Extra frosted effect.</p>
            </div>
        ),
        blur: 'xl',
    },
};

// Stories for GlassPanel
export const Panel: Meta<typeof GlassPanel> = {
    title: 'UI/Glass/Panel',
    component: GlassPanel,
    tags: ['autodocs'],
};

export const PrimaryPanel: StoryObj<typeof GlassPanel> = {
    args: {
        variant: 'primary',
        children: <p className="p-4">Primary colored glass panel</p>,
    },
};

// Stories for GlassButton
export const Button: Meta<typeof GlassButton> = {
    title: 'UI/Glass/Button',
    component: GlassButton,
    tags: ['autodocs'],
};

export const DefaultButton: StoryObj<typeof GlassButton> = {
    args: {
        children: 'Glass Button',
    },
};

// Stories for GlassInput
export const Input: Meta<typeof GlassInput> = {
    title: 'UI/Glass/Input',
    component: GlassInput,
    tags: ['autodocs'],
};

export const DefaultInput: StoryObj<typeof GlassInput> = {
    args: {
        placeholder: 'Enter something...',
    },
};
