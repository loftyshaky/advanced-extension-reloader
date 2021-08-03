import { browser } from 'webextension-polyfill-ts';

import { s_reload } from 'background/internal';

browser.contextMenus.onClicked.addListener(async (info) => {
    const settings = await ext.storage_get(['click_action', 'reload_actions']);

    s_reload.Watch.i().reload(settings.reload_actions[info.menuItemId]);
});
