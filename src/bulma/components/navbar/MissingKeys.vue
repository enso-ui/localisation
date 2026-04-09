<template>
    <core-missing-keys>
        <template #default="{ keyCollector, hover, count, events, isTouch }">
            <div class="navbar-item key-collector"
                v-if="keyCollector && !isTouch">
                <span class="has-text-info has-text-weight-bold">
                    {{ count }}
                </span>
                <span class="icon  is-clickable ml-2"
                    :class="hover ? 'has-text-success' : 'has-text-danger'"
                    v-on="events">
                    <fa :icon="hover && count ? icons.check : icons.language"/>
                </span>
            </div>
        </template>
    </core-missing-keys>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faLanguage, faCheck } from '@fortawesome/free-solid-svg-icons';
import CoreMissingKeys from '../../../core/components/navbar/MissingKeys.vue';

export default {
    name: 'MissingKeys',

    components: { CoreMissingKeys, Fa },

    data: () => ({
        icons: {
            check: faCheck,
            language: faLanguage,
        },
    }),
};
</script>
