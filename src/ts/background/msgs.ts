import { browser } from 'webextension-polyfill-ts';

import { t } from '@loftyshaky/shared';

browser.runtime.onMessage.addListener((msg: t.Msg): Promise<void> => err_async(async () => {
    const msg_str: string = msg.msg;

    if (msg_str === 'update_setting') {
        ext.storage_set(msg.val_obj);
    }
},
1009));
