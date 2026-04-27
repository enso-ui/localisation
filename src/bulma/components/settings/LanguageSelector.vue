<template>
    <core-language-selector>
        <template #default="{ flagPrefix, locale, languages, update, multiLanguage }">
            <div class="level is-mobile"
                v-if="multiLanguage">
                <div class="level-left">
                    <div class="level-item">
                        <span class="menu-item-label">
                            {{ i18n('Language') }}
                        </span>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <dropdown class="language-selector">
                            <template #label>
                                <i :class="`${flagPrefix}${languages[locale]}`"/>
                            </template>
                            <template #items>
                                <dropdown-item class="has-text-centered p-2"
                                    v-for="(flag, lang) in languages"
                                    :key="lang"
                                    :selected="locale === lang"
                                    @select="update(lang)">
                                    <span class="icon is-small">
                                        <i :class="`${flagPrefix}${flag}`"/>
                                    </span>
                                </dropdown-item>
                            </template>
                        </dropdown>
                    </div>
                </div>
            </div>
        </template>
    </core-language-selector>
</template>

<script>
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';
import CoreLanguageSelector from '../../../core/components/settings/LanguageSelector.vue';

export default {
    name: 'LanguageSelector',

    components: { CoreLanguageSelector, Dropdown, DropdownItem },

    inject: ['i18n'],
};
</script>

<style lang="scss">
    @use './flags/flags';

    .language-selector {
        .dropdown-menu {
            .dropdown-content {
                min-width: 3.3rem;
                width: 100%;
            }
        }
    }
</style>
