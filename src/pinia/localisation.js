import { defineStore } from 'pinia';
import { useStore } from '../utils/pinia';

export const localisation = defineStore('localisation', {
    state: () => ({
        i18n: {},
        languages: [],
        rtlLanguages: [],
        keyCollector: false,
        missingKeys: [],
    }),

    getters: {
        documentTitle: state => title => {
            const { global } = useStore('preferences');
            const { meta } = useStore('app');
            const value = state.i18n[global.lang]?.[title] ?? title;

            return meta.extendedDocumentTitle
                ? `${value} | ${meta.appName}`
                : value;
        },
        i18n: state => key => {
            const lang = useStore('preferences').global.lang;

            return state.i18n[lang]?.[key] ?? key;
        },
        isRtl: state => lang => state.rtlLanguages.includes(lang),
        ready: state => Object.keys(state.i18n).length > 0,
        rtl: state => state.rtlLanguages.includes(useStore('preferences').global.lang),
    },

    actions: {
        configure({ i18n, languages, rtl }) {
            this.i18n = i18n;
            this.languages = languages;
            this.rtlLanguages = rtl;
        },
        setI18n(i18n) {
            this.i18n = i18n;
        },
        setLanguages(languages) {
            this.languages = languages;
        },
        setRtl(rtl) {
            this.rtlLanguages = rtl;
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
