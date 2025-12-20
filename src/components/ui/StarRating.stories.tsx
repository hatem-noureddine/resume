import type { Meta, StoryObj } from '@storybook/react';
import { StarRating } from './StarRating';

const meta = {
    title: 'UI/StarRating',
    component: StarRating,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        postSlug: 'demo-post',
        maxStars: 5,
        size: 'md',
        showCount: true,
        showAverage: true,
        initialRating: 0,
    },
};

export const Large: Story = {
    args: {
        postSlug: 'demo-post-lg',
        maxStars: 5,
        size: 'lg',
        initialRating: 4,
    },
};

export const SmallNoStats: Story = {
    args: {
        postSlug: 'demo-post-sm',
        maxStars: 5,
        size: 'sm',
        showCount: false,
        showAverage: false,
        initialRating: 3,
    },
};
