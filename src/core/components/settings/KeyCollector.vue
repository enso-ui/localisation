<script>
import { useStore } from '../../../utils/pinia';

export default {
    name: 'KeyCollector',

    data: () => ({
        collect: false,
    }),

    computed: {
        meta() {
            return useStore('app').meta;
        },
    },

    methods: {
        setKeyCollector(state) {
            useStore('localisation').setKeyCollector(state);
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
