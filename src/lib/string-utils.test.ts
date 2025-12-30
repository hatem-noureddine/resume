import { slugify } from './string-utils';

describe('string-utils', () => {
    describe('slugify', () => {
        it('converts to lowercase', () => {
            const result = slugify('Hello World');
            expect(result).toBe('hello-world');
        });

        it('replaces spaces with hyphens', () => {
            const result = slugify('foo bar baz');
            expect(result).toBe('foo-bar-baz');
        });

        it('removes special characters', () => {
            const result = slugify('Hello, World!');
            expect(result).toBe('hello-world');
        });

        it('handles empty string', () => {
            const result = slugify('');
            expect(result).toBe('');
        });

        it('handles multiple spaces', () => {
            const result = slugify('foo   bar');
            expect(result).toBe('foo-bar');
        });

        it('trims whitespace', () => {
            const result = slugify('  hello  ');
            expect(result).toBe('hello');
        });

        it('handles numbers', () => {
            const result = slugify('Chapter 1');
            expect(result).toBe('chapter-1');
        });
    });
});
