import { browser } from 'webextension-polyfill-ts';

import { s_settings } from 'background/internal';

browser.runtime.onInstalled.addListener((details): void => err(() => {
    if (details.reason === 'install') {
        s_settings.Settings.i.update({ settings: s_settings.Settings.i.default_settings });
    }
},
1023));
