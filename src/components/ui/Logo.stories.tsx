import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
    title: 'UI/Logo',
    component: Logo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'The site logo component with hover animation.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
