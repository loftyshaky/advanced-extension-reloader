import { browser } from 'webextension-polyfill-ts';

import { s_reload } from 'background/internal';

browser.action.onClicked.addListener(
    (): Promise<void> =>
        err_async(async () => {
            const click_action = await ext.storage_get('click_action');

            s_reload.Watch.i().reload(click_action.click_action);
        }, 'aer_1008'),
);
