import { defineStore } from 'pinia';
import { app } from '@enso-ui/ui/src/pinia/app';
import { preferences } from '@enso-ui/ui/src/pinia/preferences';

export const localisation = defineStore('localisation', {
    state: () => ({
        flagPrefix: null,
        i18n: {},
        languages: [],
        rtlLanguages: [],
        keyCollector: false,
        missingKeys: [],
    }),

    getters: {
        documentTitle: state => title => {
            const { global } = preferences();
            const { meta } = app();
            const value = state.i18n[global.lang]?.[title] ?? title;

            return meta.extendedDocumentTitle
                ? `${value} | ${meta.appName}`
                : value;
        },
        translate: state => key => {
            const lang = preferences().global.lang;

            return state.i18n[lang]?.[key];
        },
        ready: state => Object.keys(state.i18n).length > 0,
        rtl: state => state.rtlLanguages.includes(preferences().global.lang),
    },

    actions: {
        set({ flagPrefix, i18n, languages, rtlLanguages }) {
            this.i18n = i18n;
            this.languages = languages;
            this.rtlLanguages = rtlLanguages;
            this.flagPrefix = flagPrefix;
        },
        setI18n(i18n) {
            this.i18n = i18n;
        },
        addKey(key) {
            Object.keys(this.i18n).forEach(lang => {
                this.i18n[lang][key] = '';
            });
        },
        setKeyCollector(status) {
            if (status === false) {
                this.missingKeys = [];
            }

            this.keyCollector = status;
        },
        clearMissingKeys() {
            this.missingKeys = [];
        },
        addMissingKey(key) {
            if (!this.missingKeys.includes(key)) {
                this.missingKeys.push(key);
            }
        },
    },
});
