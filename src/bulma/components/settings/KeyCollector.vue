<template>
    <core-key-collector>
        <template #default="{ bindings, events, isLocal }">
            <div class="level is-mobile"
                v-if="isLocal">
                <div class="level-left">
                    <div class="level-item">
                        <span class="menu-item-label">
                            {{ i18n('Key Collector') }}
                        </span>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <vue-switch v-bind="bindings"
                            v-on="events"/>
                    </div>
                </div>
            </div>
        </template>
    </core-key-collector>
</template>

<script>
import VueSwitch from '@enso-ui/switch/bulma';
import CoreKeyCollector from '../../../core/components/settings/KeyCollector.vue';

export default {
    name: 'KeyCollector',

    components: { CoreKeyCollector, VueSwitch },

    inject: ['i18n'],
};
</script>
