import { browser } from 'webextension-polyfill-ts';

import { s_badge, s_data, s_reload } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Main.i().init_defaults();
        await s_data.Main.i().set_from_storage();
        s_badge.Main.i().hide();

        browser.management.onEnabled.addListener(s_reload.Watch.i().on_enabled);
    }, 'aer_1016');
