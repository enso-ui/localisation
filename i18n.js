import { localisation as useLocalisation } from './src/pinia/localisation';

const pendingMissingKeys = new Set();

const invalid = key => key === null || key === '' || typeof key === 'undefined';

const queueMissingKey = key => {
    if (!pendingMissingKeys.has(key)) {
        pendingMissingKeys.add(key);
    
        queueMicrotask(() => {
            pendingMissingKeys.delete(key);
            useLocalisation().addMissingKey(key);
        });
    }

};

export default (key, params = null) => {
    if (invalid(key)) {
        return null;
    }

    const localisation = useLocalisation();

    if (!localisation.ready) {
        return key;
    }

    let translation = localisation.translate(key);

    if (invalid(translation)) {
        translation = key;

        if (localisation.keyCollector) {
            queueMissingKey(key);
        }
    }

    return !!params && typeof params === 'object'
        ? translation.replace(/:(\w*)/g, (e, key) => {
            if (typeof params[key.toLowerCase()] === 'undefined') {
                return key;
            }

            const param = params[key.toLowerCase()];

            if (key === key.toUpperCase()) {
                return param.toUpperCase();
            }

            return key[0] === key[0].toUpperCase()
                ? param.charAt(0).toUpperCase() + param.slice(1)
                : param;
        })
        : translation || key;
};
