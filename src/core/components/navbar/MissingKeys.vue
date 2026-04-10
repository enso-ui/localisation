<script>
import { useStore } from '../../../utils/pinia';

export default {
    name: 'MissingKeys',

    inject: ['errorHandler', 'http', 'route', 'toastr'],

    data: () => ({
        hover: false,
    }),

    computed: {
        keyCollector() {
            return useStore('localisation').keyCollector;
        },
        missingKeys() {
            return useStore('localisation').missingKeys;
        },
        isTouch() {
            return useStore('layout').isTouch;
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
            useStore('localisation').addKey(key);
        },
        clearMissingKeys() {
            useStore('localisation').clearMissingKeys();
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
