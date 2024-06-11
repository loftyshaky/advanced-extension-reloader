import { Management } from 'webextension-polyfill';

import { t } from '@loftyshaky/shared';
import { s_badge, s_data, s_reload, s_side_effects } from 'background/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (msg_str === 'reload_ext') {
            we.runtime.reload();

            return Promise.resolve(true);
        }

        if (msg_str === 'get_all_extensions') {
            return we.management
                .getAll()
                .then((response: Management.ExtensionInfo[]) => response)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'aer_1115'));
        }

        if (msg_str === 'get_settings') {
            return ext
                .storage_get()
                .then((response) => response)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'aer_1114'));
        }

        if (msg_str === 'update_settings') {
            s_data.Main.i().update_settings_debounce(
                msg.settings,
                n(msg.rerun_actions) ? msg.rerun_actions : false,
                n(msg.transform) ? msg.transform : false,
            );

            return Promise.resolve(true);
        }

        if (msg_str === 'get_defaults') {
            return Promise.resolve(s_data.Main.i().defaults);
        }

        if (msg_str === 'reload') {
            s_reload.Watch.i().try_to_reload({
                options: msg.options,
                automatic_reload: true,
            });

            return Promise.resolve(true);
        }

        if (msg_str === 'show_badge') {
            s_badge.Main.i().show_ok_badge();

            return Promise.resolve(true);
        }

        if (msg_str === 'react_to_change') {
            return s_side_effects.Main.i()
                .react_to_change()
                .then((response) => response)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'aer_1105'));
        }

        return false;
    }, 'aer_1012'),
);
