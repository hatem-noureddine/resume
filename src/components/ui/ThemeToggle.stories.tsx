import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '@/context/ThemeContext';

const meta = {
    title: 'UI/ThemeToggle',
    component: ThemeToggle,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story, context) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const args = context.args as any;
            return (
                <ThemeProvider defaultTheme={args.initialTheme}>
                    <Story />
                    <div className="mt-4 text-xs text-muted-foreground text-center">
                        Current theme: {args.initialTheme || 'system'}
                    </div>
                </ThemeProvider>
            );
        },
    ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta> & { args: { initialTheme?: string } };

export const LightMode: Story = {
    args: {
        initialTheme: 'light',
    },
};

export const DarkMode: Story = {
    args: {
        initialTheme: 'dark',
    },
};
