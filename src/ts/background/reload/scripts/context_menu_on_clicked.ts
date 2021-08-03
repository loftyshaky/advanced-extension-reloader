import { browser } from 'webextension-polyfill-ts';

import { s_reload } from 'background/internal';

browser.contextMenus.onClicked.addListener(
    (info): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get(['click_action', 'reload_actions']);

            s_reload.Watch.i().reload(settings.reload_actions[info.menuItemId]);
        }, 'aer_1055'),
);
