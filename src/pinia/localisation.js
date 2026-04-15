import { defineStore } from 'pinia';
import { useStore } from '../utils/pinia';

export const localisation = defineStore('localisation', {
    state: () => ({
        messages: {},
        languages: [],
        rtlLanguages: [],
        keyCollector: false,
        missingKeys: [],
    }),

    getters: {
        documentTitle: state => title => {
            const { global } = useStore('preferences');
            const { meta } = useStore('app');
            const value = state.messages[global.lang]?.[title] ?? title;

            return meta.extendedDocumentTitle
                ? `${value} | ${meta.appName}`
                : value;
        },
        translate: state => key => {
            const lang = useStore('preferences').global.lang;

            return state.messages[lang]?.[key];
        },
        isRtl: state => lang => state.rtlLanguages.includes(lang),
        ready: state => Object.keys(state.messages).length > 0,
        rtl: state => state.rtlLanguages.includes(useStore('preferences').global.lang),
    },

    actions: {
        configure({ i18n, languages, rtl }) {
            this.messages = i18n;
            this.languages = languages;
            this.rtlLanguages = rtl;
        },
        set(payload) {
            if (payload.i18n !== undefined) {
                this.messages = payload.i18n;
            }

            if (payload.languages !== undefined) {
                this.languages = payload.languages;
            }

            if (payload.rtlLanguages !== undefined) {
                this.rtlLanguages = payload.rtlLanguages;
            }

            if (payload.rtl !== undefined) {
                this.rtlLanguages = payload.rtl;
            }
        },
        setI18n(i18n) {
            this.messages = i18n;
        },
        setLanguages(languages) {
            this.languages = languages;
        },
        setRtl(rtl) {
            this.rtlLanguages = rtl;
        },
        addKey(key) {
            Object.keys(this.messages).forEach(lang => {
                this.messages[lang][key] = '';
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
