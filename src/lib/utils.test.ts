/**
 * String utility tests
 */
import { cn } from './utils';

describe('utils', () => {
    describe('cn (classnames)', () => {
        it('merges class names', () => {
            const result = cn('foo', 'bar');
            expect(result).toBe('foo bar');
        });

        it('handles conditional classes', () => {
            const isActive = true;
            const result = cn('base', isActive && 'active');
            expect(result).toContain('base');
            expect(result).toContain('active');
        });

        it('handles falsy values', () => {
            const result = cn('foo', false && 'bar', null, undefined, 'baz');
            expect(result).toBe('foo baz');
        });

        it('handles empty input', () => {
            const result = cn();
            expect(result).toBe('');
        });
    });
});
