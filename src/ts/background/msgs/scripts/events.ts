import { Management } from 'webextension-polyfill';

import { t } from '@loftyshaky/shared/shared_clean';
import { s_data, s_reload, s_side_effects } from 'background/internal';

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

        if (msg_str === 'check_if_ext_is_installed') {
            return we.management
                .get(typeof msg.extension_id === 'string' ? msg.extension_id : '')
                .then((response: Management.ExtensionInfo) => n(response))
                .catch((error_obj: any) => {
                    show_err_ribbon(error_obj, 'aer_1128');

                    return false;
                });
        }

        if (msg_str === 'get_settings') {
            return ext
                .storage_get()
                .then((response: any) => response)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'aer_1114'));
        }

        if (msg_str === 'update_settings') {
            if (n(msg.update_instantly) && msg.update_instantly) {
                return s_data.Manipulation.update_settings({
                    settings: msg.settings,
                    replace: n(msg.replace) ? msg.replace : false,
                    transform: n(msg.transform) ? msg.transform : false,
                    transform_force: n(msg.transform_force) ? msg.transform_force : false,
                    load_settings: n(msg.load_settings) ? msg.load_settings : false,
                    restore_back_up: n(msg.restore_back_up) ? msg.restore_back_up : false,
                })
                    .then(() => true)
                    .catch((error_obj: any) => show_err_ribbon(error_obj, 'aer_1127'));
            }

            s_data.Manipulation.update_settings_debounce(
                msg.settings,
                n(msg.replace) ? msg.replace : false,
                n(msg.transform) ? msg.transform : false,
                n(msg.transform_force) ? msg.transform_force : false,
                n(msg.load_settings) ? msg.load_settings : false,
                n(msg.restore_back_up) ? msg.restore_back_up : false,
            );

            return Promise.resolve(true);
        }

        if (msg_str === 'get_defaults') {
            return Promise.resolve(s_data.Settings.defaults);
        }

        if (msg_str === 'reload') {
            s_reload.Watch.try_to_reload({
                options: msg.options,
                automatic_reload: true,
            });

            return Promise.resolve(true);
        }

        if (msg_str === 'react_to_change') {
            return s_side_effects.SideEffects.react_to_change()
                .then((response: any) => response)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'aer_1105'));
        }

        if (msg_str === 'get_window_focus_state') {
            return s_reload.Popup.get_window_focus_state()
                .then((response: any) => response)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'aer_1150'));
        }

        if (msg_str === 'get_popup_was_open_on_extension_reload') {
            return Promise.resolve(data.popup_was_open_on_extension_reload);
        }

        if (msg_str === 'get_popup_will_reload_when_window_will_focus') {
            return Promise.resolve(data.popup_will_reload_when_window_will_focus);
        }

        if (msg_str === 'get_reloading_extensions') {
            return Promise.resolve(s_reload.Watch.reloading_extensions);
        }

        if (msg_str === 'open_popup') {
            s_reload.Popup.reload();
        }

        return false;
    }, 'aer_1012'),
);
