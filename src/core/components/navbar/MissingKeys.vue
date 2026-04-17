<script>
import { layout } from '@enso-ui/ui/src/pinia/layout';
import { localisation } from '../../../pinia/localisation';

export default {
    name: 'MissingKeys',

    inject: ['errorHandler', 'http', 'route', 'toastr'],

    data: () => ({
        hover: false,
    }),

    methods: {
        persist() {
            const store = localisation();

            this.http.patch(
                this.route('system.localisation.addKey'),
                { keys: store.missingKeys },
            ).then(({ data }) => {
                store.missingKeys.forEach(key => store.addKey(key));
                store.clearMissingKeys();
                this.toastr.success(data.message);
            }).catch(this.errorHandler);
        },
    },

    render() {
        const store = localisation();

        return this.$slots.default({
            keyCollector: store.keyCollector,
            isTouch: layout().isTouch,
            hover: this.hover,
            count: store.missingKeys.length,
            events: {
                click: this.persist,
                mouseenter: () => (this.hover = true),
                mouseleave: () => (this.hover = false),
            },
        });
    },
};
</script>
