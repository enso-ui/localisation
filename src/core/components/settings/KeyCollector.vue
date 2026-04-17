<script>
import { app as useApp } from '@enso-ui/ui/src/pinia/app';
import { localisation as useLocalisation } from '../../../pinia/localisation';

export default {
    name: 'KeyCollector',

    computed: {
        meta() {
            return useApp().meta;
        },
        collect: {
            get() {
                return useLocalisation().keyCollector;
            },
            set(state) {
                useLocalisation().setKeyCollector(state);
            },
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
                },
            },
        });
    },
};

</script>
