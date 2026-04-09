<template>
    <div class="wrapper">
        <div class="columns is-variable is-5 is-multiline edit-texts-header">
            <div class="column is-8-desktop">
                <div class="columns is-multiline is-vcentered">
                    <div class="column is-half-desktop">
                        <enso-select :options="locales"
                            v-model="selectedLocale"
                            @update:model-value="getLangFile()"
                            :placeholder="i18n('Choose language')"/>
                    </div>
                    <fade>
                        <div class="column is-half-desktop has-text-right-desktop"
                            v-if="selectedLocale">
                            <p class="edit-texts-key-count">
                                <b>{{ keysCount }}</b> {{ i18n('keys found') }}
                            </p>
                        </div>
                    </fade>
                </div>
            </div>
            <div class="column is-4-desktop">
                <div class="edit-texts-actions">
                    <button class="button is-outlined is-info"
                        v-if="selectedLocale && isNewKey"
                        @click="addKey()">
                        {{ i18n('Add Key') }}
                    </button>
                    <button class="button is-warning is-fullwidth"
                        v-if="!selectedLocale && meta.env === 'local'
                            && canAccess('system.localisation.merge')"
                        @click="merge()">
                        {{ i18n('Merge all localisation files') }}
                    </button>
                    <button @click="saveLangFile()"
                        v-if="selectedLocale"
                        :class="['button is-success', { 'is-loading': loading }]">
                        {{ i18n('Update') }}
                    </button>
                </div>
            </div>
            <fade>
                <div class="column is-7-desktop"
                    v-if="selectedLocale">
                    <div class="field edit-texts-search">
                        <p class="control has-icons-left has-icons-right">
                            <input id="search-input"
                                type="text"
                                class="input is-rounded"
                                v-focus
                                v-select-on-focus
                                :placeholder="i18n('Search')"
                                v-model="query"
                                @keyup.enter="isNewKey ? addKey() : focusIt(null)">
                            <span class="icon is-small is-left has-text-muted">
                                <fa :icon="icons.search"/>
                            </span>
                            <span class="icon is-small is-right clear-button has-text-muted is-clickable"
                                v-if="query"
                                @click="query = null">
                                <a class="delete is-small"/>
                            </span>
                        </p>
                    </div>
                </div>
            </fade>
            <fade>
                <div class="column is-5-desktop"
                    v-if="selectedLocale">
                    <div class="edit-texts-filters">
                        <label class="edit-texts-filter">
                            <span>{{ i18n('Core') }}</span>
                            <vue-switch class="mx-2"
                                v-model="filterCore"
                                size="is-large"/>
                            <span>{{ i18n('App') }}</span>
                        </label>
                        <label class="edit-texts-filter">
                            <span>{{ i18n('Only missing') }}</span>
                            <vue-switch class="ml-2"
                                v-model="filterMissing"
                                size="is-large"/>
                        </label>
                    </div>
                </div>
            </fade>
        </div>
        <div class="box localisation-texts-box mt-3"
            v-if="selectedLocale">
            <div class="columns is-hidden-mobile has-shadow-bottom"
                v-if="filteredKeys.length">
                <div class="column is-half has-text-centered">
                    <h6 class="title is-6">
                        {{ i18n('Key') }}
                    </h6>
                </div>
                <div class="column is-half has-text-centered">
                    <h6 class="title is-6">
                        {{ i18n('Value') }}
                    </h6>
                </div>
            </div>
            <div class="has-text-centered"
                v-else>
                <h5 class="subtitle is-5">
                    {{ i18n('No keys found') }}
                </h5>
            </div>
            <div :style="styleObject">
                <div class="columns localisation-texts-row"
                    :key="index"
                    v-for="(key, index) in filteredKeys">
                    <div class="column is-half">
                        <input type="text" class="input" readonly :value="key">
                    </div>
                    <div class="column is-half">
                        <div class="field has-addons">
                            <p class="control is-expanded">
                                <input type="text"
                                    v-select-on-focus
                                    v-model="langFile[key]"
                                    :id="key"
                                    class="input"
                                    @keyup.enter="focusIt('search-input')">
                            </p>
                            <p class="control">
                                <a class="button is-outlined is-danger"
                                    @click="removeKey(key)">
                                    <span class="icon is-small">
                                        <fa :icon="icons.delete"/>
                                    </span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Fade } from '@enso-ui/transitions';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faSearch, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { focus, selectOnFocus } from '@enso-ui/directives';
import { EnsoSelect } from '@enso-ui/select/bulma';
import VueSwitch from '@enso-ui/switch/bulma';
import { useStore } from '../../../utils/pinia';

export default {
    name: 'EditTexts',

    directives: { focus, selectOnFocus },

    components: {
        EnsoSelect, Fa, Fade, VueSwitch,
    },

    inject: ['canAccess', 'errorHandler', 'i18n', 'http', 'route', 'toastr'],

    data: () => ({
        icons: {
            delete: faTrashCan,
            search: faSearch,
        },
        langFile: {},
        originalLangFile: {},
        locales: [],
        selectedLocale: null,
        query: null,
        boxHeight: 0,
        loading: false,
        filterMissing: false,
        filterCore: true,
    }),

    computed: {
        isMobile() {
            return useStore('layout').isMobile;
        },
        meta() {
            return useStore('app').meta;
        },
        styleObject() {
            return {
                'max-height': this.boxHeight,
                'overflow-y': 'auto',
                'overflow-x': 'hidden',
            };
        },
        langKeys() {
            return this.filterMissing
                ? Object.keys(this.originalLangFile).filter(key => !this.originalLangFile[key])
                : Object.keys(this.langFile);
        },
        filteredKeys() {
            if (!this.query) {
                return this.sortedKeys();
            }

            const query = this.query.toLowerCase();

            return this.langKeys.filter(key => (key.toLowerCase().indexOf(query) > -1
                || (this.langFile[key] && this.langFile[key].toLowerCase().indexOf(query) > -1)));
        },
        isNewKey() {
            return this.selectedLocale
                && this.query && this.filteredKeys.indexOf(this.query) === -1;
        },
        keysCount() {
            return this.langKeys.length;
        },
        subDir() {
            return this.filterCore ? 'app' : 'enso';
        },
    },

    watch: {
        isMobile: {
            handler: 'setBoxHeight',
        },
        filterCore: {
            handler: 'getLangFile',
        },
    },

    created() {
        this.init();
        this.setBoxHeight();
    },

    methods: {
        init() {
            this.loading = true;

            this.http.get(this.route('system.localisation.editTexts'))
                .then(({ data }) => {
                    this.loading = false;
                    this.locales = data;
                }).catch(this.errorHandler);
        },
        getLangFile() {
            if (!this.selectedLocale) {
                this.langFile = {};
                this.updateOriginal();
                return;
            }

            this.loading = true;

            this.http.get(this.route('system.localisation.getLangFile', {
                subDir: this.subDir,
                language: this.selectedLocale,
            })).then(({ data }) => {
                this.loading = false;
                this.langFile = data;
                this.updateOriginal();
            }).catch(this.errorHandler);
        },
        saveLangFile() {
            this.loading = true;

            this.http.patch(this.route('system.localisation.saveLangFile', {
                subDir: this.subDir,
                language: this.selectedLocale,
            }), {
                langFile: this.langFile,
            }).then(({ data }) => {
                this.loading = false;
                this.toastr.success(data.message);
            }).catch(this.errorHandler);
        },
        addKey() {
            this.langFile[this.query] = null;
            this.updateOriginal();
            this.focusIt();
        },
        removeKey(key) {
            delete this.langFile[key];
            this.updateOriginal();
        },
        focusIt(id = null) {
            id = id || this.query;

            this.$nextTick(() => {
                document.getElementById(id).focus();
            });
        },
        setBoxHeight() {
            this.boxHeight = document.body.clientHeight - (this.isMobile ? 420 : 388);
        },
        updateOriginal() {
            this.originalLangFile = JSON.parse(JSON.stringify(this.langFile));
        },
        merge() {
            this.http.patch(this.route('system.localisation.merge'))
                .then(({ data }) => {
                    this.loading = false;
                    this.toastr.success(data.message);
                }).catch(this.errorHandler);
        },
        sortedKeys() {
            return this.langKeys.sort((a, b) => {
                if (a.toLowerCase() < b.toLowerCase()) {
                    return -1;
                }

                if (a.toLowerCase() > b.toLowerCase()) {
                    return 1;
                }

                return 0;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
    .wrapper {
        :deep(.vue-select) {
            --enso-select-dropdown-surface: var(--bulma-scheme-main-bis);
            --enso-select-item-hover-surface: color-mix(
                in srgb,
                var(--bulma-scheme-main-ter) 86%,
                var(--bulma-primary) 14%
            );
        }

        :deep(.input::placeholder) {
            color: var(--bulma-text-light);
            opacity: 0.8;
        }
    }

    .edit-texts-header {
        align-items: end;
    }

    .edit-texts-key-count {
        color: var(--bulma-text-strong);
        line-height: 2.75rem;
        margin: 0;
    }

    .edit-texts-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: flex-end;

        .button {
            min-width: 10rem;
        }
    }

    .edit-texts-search {
        margin-bottom: 0;

        .input {
            min-height: 2.55rem;
            padding-left: 2.55rem;
            padding-right: 2.55rem;
        }
    }

    .edit-texts-filters {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        justify-content: flex-end;
        min-height: 3rem;
    }

    .edit-texts-filter {
        align-items: center;
        color: var(--bulma-text-strong);
        display: inline-flex;
        gap: 0.5rem;
        margin: 0;
        white-space: nowrap;
    }

    .edit-texts-filter :deep(.vue-switch) {
        .control-label {
            color: var(--bulma-text-strong);
        }

        .control-switch {
            background-color: color-mix(
                in srgb,
                var(--bulma-scheme-main) 82%,
                var(--bulma-border)
            );
            border-color: color-mix(
                in srgb,
                var(--bulma-scheme-main) 82%,
                var(--bulma-border)
            );

            &:before {
                background-color: color-mix(
                    in srgb,
                    var(--bulma-scheme-main-ter) 80%,
                    var(--bulma-border)
                );
            }

            &:after {
                background-color: var(--bulma-text-strong);
                box-shadow: none;
            }

            &.checked {
                background-color: var(--bulma-primary);
                border-color: var(--bulma-primary);
            }
        }
    }

    .localisation-texts-box {
        padding: 1rem 1rem 1.25rem;

        .title,
        .subtitle {
            color: var(--bulma-text-strong);
        }

        .input {
            background-color: var(--bulma-scheme-main);
            border-color: color-mix(
                in srgb,
                var(--bulma-border) 78%,
                transparent
            );
            box-shadow: none;
            color: var(--bulma-text-strong);
        }

        .input[readonly] {
            background-color: color-mix(
                in srgb,
                var(--bulma-scheme-main) 84%,
                var(--bulma-scheme-main-ter)
            );
            color: var(--bulma-text);
        }

        .field.has-addons .button.is-outlined.is-danger {
            background-color: color-mix(
                in srgb,
                var(--bulma-danger) 8%,
                var(--bulma-scheme-main-bis)
            );
            border-color: color-mix(
                in srgb,
                var(--bulma-danger) 40%,
                var(--bulma-border)
            );
            color: var(--bulma-danger);
            min-width: 3rem;
        }
    }

    .localisation-texts-row {
        align-items: center;
        margin-bottom: 0.25rem;
    }

    .has-shadow-bottom {
        -webkit-box-shadow: inset 0 -1px 0 var(--bulma-border);
        box-shadow: inset 0 -1px 0 var(--bulma-border);
    }

    .icon.clear-button {
        pointer-events: all;
    }

    @media (max-width: 1023px) {
        .edit-texts-actions,
        .edit-texts-filters {
            justify-content: flex-start;
        }

        .edit-texts-key-count {
            line-height: 1.5;
            text-align: left;
        }
    }
</style>
