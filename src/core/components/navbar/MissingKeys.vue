<script>
import { layout as useLayout } from '@enso-ui/ui/src/pinia/layout';
import { localisation as useLocalisation } from '../../../pinia/localisation';

export default {
    name: 'MissingKeys',

    inject: ['errorHandler', 'http', 'route', 'toastr'],

    data: () => ({
        hover: false,
    }),

    computed: {
        keyCollector() {
            return useLocalisation().keyCollector;
        },
        missingKeys() {
            return useLocalisation().missingKeys;
        },
        isTouch() {
            return useLayout().isTouch;
        },
        count() {
            return this.missingKeys.length;
        },
        mappedKeys() {
            return this.missingKeys
                .map(key => ({ [key]: null }));
        },
    },

    methods: {
        addKey(key) {
            useLocalisation().addKey(key);
        },
        clearMissingKeys() {
            useLocalisation().clearMissingKeys();
        },
        persist() {
            this.http.patch(
                this.route('system.localisation.addKey'),
                { keys: this.missingKeys },
            ).then(({ data }) => {
                this.missingKeys.forEach(key => this.addKey(key));
                this.clearMissingKeys();
                this.toastr.success(data.message);
            }).catch(this.errorHandler);
        },
    },

    render() {
        return this.$slots.default({
            keyCollector: this.keyCollector,
            isTouch: this.isTouch,
            hover: this.hover,
            count: this.count,
            events: {
                click: this.persist,
                mouseenter: () => (this.hover = true),
                mouseleave: () => (this.hover = false),
            },
        });
    },
};
</script>
