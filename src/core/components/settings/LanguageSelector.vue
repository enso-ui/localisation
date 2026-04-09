<script>
import { useStore } from '../../utils/pinia';

export default {
    name: 'LanguageSelector',

    computed: {
        languages() {
            return useStore('localisation').languages;
        },
        lang() {
            return useStore('preferences').global.lang;
        },
        multiLanguage() {
            return Object.keys(this.languages).length > 1;
        },
    },

    methods: {
        setLang(lang) {
            return useStore('preferences').setLang(lang);
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
