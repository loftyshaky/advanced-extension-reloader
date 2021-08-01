import { browser } from 'webextension-polyfill-ts';

import { t } from '@loftyshaky/shared';
import {
    s_settings,
    s_side_effects,
} from 'background/internal';

browser.runtime.onMessage.addListener((msg: t.Msg): Promise<any> => err_async(async () => {
    const msg_str: string = msg.msg;

    if (msg_str === 'update_setting') {
        s_settings.Settings.i.update_debounced({ settings: msg.settings });
    } else if (msg_str === 'get_defaults') {
        return s_settings.Settings.i.default_settings;
    } else if (msg_str === 'react_to_change') {
        s_side_effects.SideEffects.i.react_to_change();
    }

    return true;
},
1009));
