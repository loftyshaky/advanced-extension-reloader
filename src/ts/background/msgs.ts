import { browser } from 'webextension-polyfill-ts';

import { t } from '@loftyshaky/shared';
import { s_settings } from 'background/internal';

browser.runtime.onMessage.addListener((msg: t.Msg): Promise<void> => err_async(async () => {
    const msg_str: string = msg.msg;

    if (msg_str === 'update_setting') {
        s_settings.Settings.i.update({ settings: msg.settings });
    }
},
1009));
