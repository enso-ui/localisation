<template>
    <div class="wrapper localisation">
        <div class="box">
            <div class="columns is-mobile is-variable is-1">
                <div class="column is-half-mobile is-narrow">
                    <enso-select :options="locales"
                        class="language-selector"
                        v-model="selectedLocale"
                        @update:model-value="getLangFile()"
                        :placeholder="i18n('Choose language')"/>
                </div>
                <div class="column is-half-mobile">
                    <div class="field edit-texts-search"
                        v-if="selectedLocale">
                        <p class="control has-icons-left has-icons-right">
                            <input id="search-input"
                                type="text"
                                class="input"
                                v-focus
                                v-select-on-focus
                                :placeholder="i18n('Search')"
                                v-model="query"
                                @keyup.enter="isNewKey ? addKey() : focusIt()">
                            <span class="icon is-small is-left">
                                <fa :icon="icons.search"/>
                            </span>
                            <span class="icon is-small is-right clear-button is-clickable"
                                v-if="query"
                                @click="query = null">
                                <a class="delete is-small"/>
                            </span>
                        </p>
                    </div>
                </div>
                <div class="column is-half-mobile is-narrow">
                    <div class="mt-1 px-2"
                        v-if="selectedLocale">
                        <vue-switch class="is-medium"
                            v-model="filterMissing"
                            size="is-medium">
                            <template #before>
                                <label class="label is-medium mr-2">
                                    <span>{{ i18n('Missing') }}</span>
                                </label>
                            </template>
                        </vue-switch>
                    </div>
                </div>
                <div class="column is-half-mobile is-narrow">
                    <button class="button is-outlined is-info"
                        v-if="selectedLocale && isNewKey"
                        @click="addKey()">
                        {{ i18n('Add Key') }}
                    </button>
                    <button @click="saveLangFile()"
                        v-if="selectedLocale"
                        :class="['button is-dark', { 'is-loading': loading }]">
                        {{ i18n('Update') }}
                    </button>
                </div>
            </div>
        </div>
        <div class="box localisation-texts-box mt-3"
            v-if="selectedLocale">
            <div class="columns is-hidden-mobile"
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
            <div class="columns"
                v-for="(key, index) in visibleKeys"
                :key="index">
                <div class="column is-half py-1">
                    <input type="text"
                        class="input"
                        readonly
                        :value="key">
                </div>
                <div class="column is-half py-1">
                    <div class="field has-addons">
                        <p class="control is-expanded">
                            <input class="input"
                                type="text"
                                v-select-on-focus
                                v-model="langFile[key]"
                                :id="key"
                                @keyup.enter="focusIt('search-input')">
                        </p>
                        <p class="control">
                            <a class="button is-outlined"
                                @click="removeKey(key)">
                                <span class="icon is-small">
                                    <fa :icon="icons.delete"/>
                                </span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <enso-pagination class="is-small"
                :length="filteredKeys.length"
                :loading="loading"
                :page="page"
                :page-size="pageSize"
                @page-changed="page = $event"/>
        </div>
    </div>
</template>

<script>
import { focus, selectOnFocus } from '@enso-ui/directives';
import { EnsoPagination } from '@enso-ui/pagination/bulma';
import { EnsoSelect } from '@enso-ui/select/bulma';
import VueSwitch from '@enso-ui/switch/bulma';
import { faSearch, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';

export default {
    name: 'EditTexts',

    directives: { focus, selectOnFocus },

    components: {
        EnsoPagination, EnsoSelect, Fa, VueSwitch,
    },

    inject: ['errorHandler', 'i18n', 'http', 'route', 'toastr'],

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
        loading: false,
        filterMissing: false,
        page: 1,
        pageSize: 20,
    }),

    computed: {
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

            return this.langKeys.filter(key => key.toLowerCase().includes(query)
                || this.langFile[key]?.toLowerCase().includes(query));
        },
        visibleKeys() {
            const start = (this.page - 1) * this.pageSize;

            return this.filteredKeys.slice(start, start + this.pageSize);
        },
        isNewKey() {
            return this.selectedLocale
                && this.query
                && !this.filteredKeys.includes(this.query);
        },
        totalPages() {
            return Math.max(Math.ceil(this.filteredKeys.length / this.pageSize), 1);
        },
    },

    watch: {
        filterMissing: {
            handler: 'resetPage',
        },
        query: {
            handler: 'resetPage',
        },
        selectedLocale: {
            handler: 'resetPage',
        },
        filteredKeys() {
            if (this.page > this.totalPages) {
                this.page = this.totalPages;
            }
        },
    },

    created() {
        this.init();
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
            this.resetPage();

            this.http.get(this.route('system.localisation.getLangFile', {
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
            this.resetPage();
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
        resetPage() {
            this.page = 1;
        },
        updateOriginal() {
            this.originalLangFile = JSON.parse(JSON.stringify(this.langFile));
        },
        sortedKeys() {
            return this.langKeys.sort((firstKey, secondKey) => {
                if (firstKey.toLowerCase() < secondKey.toLowerCase()) {
                    return -1;
                }

                if (firstKey.toLowerCase() > secondKey.toLowerCase()) {
                    return 1;
                }

                return 0;
            });
        },
    },
};
</script>

<style lang="scss">
.wrapper.localisation {
    .language-selector {
        width: 15rem;
    }
}
</style>
