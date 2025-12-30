import { slugify } from '@/lib/string-utils';

describe('Library Utils', () => {
    describe('string-utils', () => {
        describe('slugify', () => {
            it('converts text to slug', () => {
                expect(slugify('Hello World')).toBe('hello-world');
            });

            it('handles special characters', () => {
                expect(slugify('Hello & World!')).toBe('hello-world');
            });

            it('handles multiple spaces and hyphens', () => {
                expect(slugify('Hello   World--Test')).toBe('hello-world-test');
            });

            it('handles mostly non-word chars', () => {
                expect(slugify('@#$')).toBe('');
            });
        });
    });
});
