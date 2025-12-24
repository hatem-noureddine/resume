/**
 * Tests for animations utility
 */
import {
    fadeInUp,
    staggerContainer,
    scaleIn,
    fadeIn,
    slideUp,
    transitions,
    durations,
    easings,
    getMotionVariants,
    getMotionAnimation,
    withReducedMotion,
    conditionalAnimation
} from './animations';

describe('animations', () => {
    describe('durations', () => {
        it('has predefined durations', () => {
            expect(durations.fast).toBe(0.15);
            expect(durations.normal).toBe(0.3);
            expect(durations.slow).toBe(0.5);
        });
    });

    describe('easings', () => {
        it('has default easing curve', () => {
            expect(easings.default).toEqual([0.4, 0, 0.2, 1]);
        });
    });

    describe('transitions', () => {
        it('has default transition', () => {
            expect(transitions.default.duration).toBe(durations.normal);
        });

        it('has spring transition', () => {
            expect(transitions.spring.type).toBe('spring');
        });
    });

    describe('fadeInUp', () => {
        it('has hidden state with opacity 0 and y offset', () => {
            expect(fadeInUp.hidden).toEqual({
                opacity: 0,
                y: 20,
            });
        });

        it('has visible state with full opacity and no offset', () => {
            expect(fadeInUp.visible).toMatchObject({
                opacity: 1,
                y: 0,
            });
        });
    });

    describe('staggerContainer', () => {
        it('has stagger children transition', () => {
            expect((staggerContainer.visible as any).transition.staggerChildren).toBe(0.1);
        });
    });

    describe('scaleIn', () => {
        it('has hidden state with reduced scale', () => {
            expect((scaleIn.hidden as any).scale).toBe(0.8);
        });

        it('has visible state with normal scale', () => {
            expect((scaleIn.visible as any).scale).toBe(1);
        });
    });

    describe('fadeIn', () => {
        it('has hidden state with zero opacity', () => {
            expect((fadeIn.hidden as any).opacity).toBe(0);
        });

        it('has visible state with full opacity', () => {
            expect((fadeIn.visible as any).opacity).toBe(1);
        });
    });

    describe('slideUp', () => {
        it('has hidden state with y offset', () => {
            expect((slideUp.hidden as any).y).toBe(50);
        });

        it('has visible state with no offset', () => {
            expect((slideUp.visible as any).y).toBe(0);
        });
    });

    describe('getMotionVariants', () => {
        it('returns variants when motion is allowed', () => {
            const result = getMotionVariants(fadeIn, false);
            expect(result).toBe(fadeIn);
        });

        it('returns empty object when reduced motion is preferred', () => {
            const result = getMotionVariants(fadeIn, true);
            expect(result).toEqual({});
        });
    });

    describe('getMotionAnimation', () => {
        it('returns animation when motion is allowed', () => {
            const animation = { opacity: 1 };
            const result = getMotionAnimation(animation, false);
            expect(result).toBe(animation);
        });

        it('returns empty object when reduced motion is preferred', () => {
            const animation = { opacity: 1 };
            const result = getMotionAnimation(animation, true);
            expect(result).toEqual({});
        });
    });

    describe('withReducedMotion (deprecated)', () => {
        it('returns variants when motion is allowed', () => {
            const result = withReducedMotion(fadeIn, false);
            expect(result).toBe(fadeIn);
        });

        it('returns empty object when reduced motion is preferred', () => {
            const result = withReducedMotion(fadeIn, true);
            expect(result).toEqual({});
        });
    });

    describe('conditionalAnimation (deprecated)', () => {
        it('returns animation when motion is allowed', () => {
            const animation = { x: 100 };
            const result = conditionalAnimation(animation, false);
            expect(result).toBe(animation);
        });

        it('returns empty object when reduced motion is preferred', () => {
            const animation = { x: 100 };
            const result = conditionalAnimation(animation, true);
            expect(result).toEqual({});
        });
    });
});
