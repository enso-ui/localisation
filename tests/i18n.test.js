import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, defineStore, setActivePinia } from 'pinia';
import i18n from '../i18n';
import { localisation } from '../src/pinia/localisation';

const usePreferences = defineStore('preferences', {
    state: () => ({
        global: {
            lang: 'ro',
        },
    }),

    actions: {
        setLangValue(lang) {
            this.global.lang = lang;
        },
    },
});

const useApp = defineStore('app', {
    state: () => ({
        meta: {
            appName: 'Enso',
            extendedDocumentTitle: true,
        },
    }),
});

describe('localisation i18n', () => {
    beforeEach(() => {
        const pinia = createPinia();

        setActivePinia(pinia);
        usePreferences(pinia);
        useApp(pinia);
        localisation(pinia);
    });

    it('returns null for empty keys', () => {
        expect(i18n('')).toBeNull();
        expect(i18n(null)).toBeNull();
        expect(i18n(undefined)).toBeNull();
    });

    it('returns translations when they exist', () => {
        const store = localisation();

        store.setI18n({
            ro: {
                Hello: 'Salut',
            },
        });

        expect(i18n('Hello')).toBe('Salut');
        expect(store.translate('Hello')).toBe('Salut');
    });

    it('falls back to the key without collecting when key collector is disabled', () => {
        const store = localisation();

        store.setI18n({
            ro: {
                Hello: 'Salut',
            },
        });

        expect(i18n('Missing key')).toBe('Missing key');
        expect(store.translate('Missing key')).toBeUndefined();
        expect(store.missingKeys).toEqual([]);
    });

    it('collects missing keys exactly once when key collector is enabled', () => {
        const store = localisation();

        store.setI18n({
            ro: {
                Hello: 'Salut',
            },
        });

        store.setKeyCollector(true);

        expect(i18n('Missing key')).toBe('Missing key');
        expect(i18n('Missing key')).toBe('Missing key');
        expect(store.missingKeys).toEqual(['Missing key']);
    });

    it('interpolates params while preserving placeholder casing', () => {
        const store = localisation();

        store.setI18n({
            ro: {
                Greeting: 'Salut :name, bine ai venit la :Place si :CODE',
            },
        });

        expect(i18n('Greeting', {
            name: 'adi',
            place: 'solarlink',
            code: 'ro42',
        })).toBe('Salut adi, bine ai venit la Solarlink si RO42');
    });
});
