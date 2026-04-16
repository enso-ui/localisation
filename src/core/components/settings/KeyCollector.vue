<script>
import { app as useApp } from '@enso-ui/ui/src/pinia/app';
import { localisation as useLocalisation } from '../../../pinia/localisation';

export default {
    name: 'KeyCollector',

    data: () => ({
        collect: false,
    }),

    computed: {
        meta() {
            return useApp().meta;
        },
    },

    methods: {
        setKeyCollector(state) {
            useLocalisation().setKeyCollector(state);
        },
    },

    render() {
        return this.$slots.default({
            isLocal: this.meta.env === 'local',
            bindings: {
                modelValue: this.collect,
            },
            events: {
                'update:modelValue': state => {
                    this.collect = state;
                    this.setKeyCollector(state);
                },
            },
        });
    },
};

</script>
