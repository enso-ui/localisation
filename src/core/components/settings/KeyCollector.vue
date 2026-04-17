<script>
import { app } from '@enso-ui/ui/src/pinia/app';
import { localisation } from '../../../pinia/localisation';

export default {
    name: 'KeyCollector',

    render() {
        return this.$slots.default({
            isLocal: app().meta.env === 'local',
            bindings: {
                modelValue: localisation().keyCollector,
            },
            events: {
                'update:modelValue': state => localisation().setKeyCollector(state),
            },
        });
    },
};

</script>
