import MissingKey from './components/navbar/MissingKeys.vue';
import KeyCollector from './components/settings/KeyCollector.vue';
import LanguageSelector from './components/settings/LanguageSelector.vue';

export default App => {
    App.registerNavbarItem('missing-key', MissingKey, 100);
    App.registerSettingsItem('language-selector', LanguageSelector, 100);
    App.registerSettingsItem('key-collector', KeyCollector, 600);
};
