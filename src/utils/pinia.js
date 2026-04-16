import App from '@enso-ui/ui/src/core/app';

export const useStore = id => {
    const store = App.store?._s?.get(id);

    if (!store) {
        throw new Error(`Missing Pinia store: ${id}`);
    }

    return store;
};
