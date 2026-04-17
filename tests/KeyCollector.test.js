import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, defineStore, setActivePinia } from 'pinia';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import CoreKeyCollector from '../src/core/components/settings/KeyCollector.vue';

const useApp = defineStore('app', {
    state: () => ({
        meta: {
            env: 'local',
        },
    }),
});

describe('KeyCollector', () => {
    let pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        useApp(pinia);
    });

    it('syncs model updates directly to the localisation store', async () => {
        const { localisation } = await import('../src/pinia/localisation');
        const store = localisation(pinia);

        const wrapper = mount(CoreKeyCollector, {
            slots: {
                default: ({ bindings, events }) => h('button', {
                    class: 'collector-toggle',
                    onClick: () => events['update:modelValue'](!bindings.modelValue),
                }, String(bindings.modelValue)),
            },
        });

        expect(store.keyCollector).toBe(false);

        await wrapper.find('.collector-toggle').trigger('click');

        expect(store.keyCollector).toBe(true);
        expect(wrapper.text()).toContain('true');
    });
});
