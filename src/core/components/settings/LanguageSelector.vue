<script>
import { preferences as usePreferences } from '@enso-ui/ui/src/pinia/preferences';
import { localisation as useLocalisation } from '../../../pinia/localisation';

export default {
    name: 'LanguageSelector',

    computed: {
        languages() {
            return useLocalisation().languages;
        },
        lang() {
            return usePreferences().global.lang;
        },
        multiLanguage() {
            return Object.keys(this.languages).length > 1;
        },
    },

    methods: {
        setLang(lang) {
            return usePreferences().setLang(lang);
        },
    },

    render() {
        return this.$slots.default({
            multiLanguage: this.multiLanguage,
            locale: this.lang,
            languages: this.languages,
            update: this.setLang,
        });
    },
};

</script>
