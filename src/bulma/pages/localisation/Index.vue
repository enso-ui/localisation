<template>
    <enso-table class="box p-0"
        id="languages">
        <template #flag="{ row }">
            <span class="icon is-small">
                <i :class="row.flag"/>
            </span>
        </template>
    </enso-table>
</template>

<script>
import { EnsoTable } from '@enso-ui/tables/bulma';

export default {
    name: 'Index',

    components: { EnsoTable },
};
</script>
