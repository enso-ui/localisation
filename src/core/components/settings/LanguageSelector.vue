<script>
import { preferences } from '@enso-ui/ui/src/pinia/preferences';
import { localisation } from '../../../pinia/localisation';

export default {
    name: 'LanguageSelector',

    methods: {
        setLang(lang) {
            return preferences().setLang(lang);
        },
    },

    render() {
        return this.$slots.default({
            multiLanguage: Object.keys(localisation().languages).length > 1,
            locale: preferences().global.lang,
            languages: localisation().languages,
            flagPrefix: localisation().flagPrefix,
            update: this.setLang,
        });
    },
};

</script>
