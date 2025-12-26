import { SITE_CONFIG, SITE_METADATA, VIEWPORT_CONFIG, JSON_LD } from './site';

describe('site configuration', () => {
    describe('SITE_CONFIG', () => {
        it('should have required name and title', () => {
            expect(SITE_CONFIG.name).toBe('Hatem Noureddine');
            expect(SITE_CONFIG.title).toBe('Kotlin Android Developer');
        });

        it('should have valid email format', () => {
            expect(SITE_CONFIG.email).toMatch(/^[\w.-]+@[\w.-]+\.\w+$/);
        });

        it('should have required links', () => {
            expect(SITE_CONFIG.links.github).toBeDefined();
            expect(SITE_CONFIG.links.linkedin).toBeDefined();
            expect(SITE_CONFIG.links.twitter).toBeDefined();
            expect(SITE_CONFIG.links.resume).toBeDefined();
        });

        it('should have valid URL', () => {
            expect(SITE_CONFIG.url).toMatch(/^https?:\/\//);
        });

        it('should have formspree config', () => {
            expect(SITE_CONFIG.formspree).toBeDefined();
            expect(SITE_CONFIG.formspree.contactFormId).toBeDefined();
        });

        it('should have giscus config', () => {
            expect(SITE_CONFIG.giscus).toBeDefined();
            expect(SITE_CONFIG.giscus.repo).toBeDefined();
        });
    });

    describe('SITE_METADATA', () => {
        it('should have title containing site name', () => {
            expect(SITE_METADATA.title).toContain(SITE_CONFIG.name);
        });

        it('should have description', () => {
            expect(SITE_METADATA.description).toBeDefined();
            expect(typeof SITE_METADATA.description).toBe('string');
        });

        it('should have keywords array', () => {
            expect(SITE_METADATA.keywords).toBeDefined();
            expect(Array.isArray(SITE_METADATA.keywords)).toBe(true);
        });

        it('should have authors', () => {
            expect(SITE_METADATA.authors).toBeDefined();
            expect(Array.isArray(SITE_METADATA.authors)).toBe(true);
        });

        it('should have openGraph configuration', () => {
            expect(SITE_METADATA.openGraph).toBeDefined();
            const og = SITE_METADATA.openGraph as Record<string, unknown>;
            expect(og.type).toBe('website');
            expect(og.locale).toBe('en_US');
        });

        it('should have twitter configuration', () => {
            expect(SITE_METADATA.twitter).toBeDefined();
            const twitter = SITE_METADATA.twitter as Record<string, unknown>;
            expect(twitter.card).toBe('summary_large_image');
        });

        it('should have icons configuration', () => {
            expect(SITE_METADATA.icons).toBeDefined();
        });

        it('should have alternates with language variants', () => {
            expect(SITE_METADATA.alternates).toBeDefined();
            expect(SITE_METADATA.alternates?.languages).toBeDefined();
        });
    });

    describe('VIEWPORT_CONFIG', () => {
        it('should have width set to device-width', () => {
            expect(VIEWPORT_CONFIG.width).toBe('device-width');
        });

        it('should have initial scale of 1', () => {
            expect(VIEWPORT_CONFIG.initialScale).toBe(1);
        });

        it('should have theme colors for light and dark modes', () => {
            expect(VIEWPORT_CONFIG.themeColor).toBeDefined();
            expect(Array.isArray(VIEWPORT_CONFIG.themeColor)).toBe(true);
            expect(VIEWPORT_CONFIG.themeColor.length).toBe(2);
        });
    });

    describe('JSON_LD', () => {
        it('should have correct schema context', () => {
            expect(JSON_LD['@context']).toBe('https://schema.org');
        });

        it('should be of type Person', () => {
            expect(JSON_LD['@type']).toBe('Person');
        });

        it('should have name and url', () => {
            expect(JSON_LD.name).toBe(SITE_CONFIG.name);
            expect(JSON_LD.url).toBe(SITE_CONFIG.url);
        });

        it('should have sameAs with social links', () => {
            expect(JSON_LD.sameAs).toBeDefined();
            expect(Array.isArray(JSON_LD.sameAs)).toBe(true);
            expect(JSON_LD.sameAs).toContain(SITE_CONFIG.links.github);
            expect(JSON_LD.sameAs).toContain(SITE_CONFIG.links.linkedin);
        });
    });
});
