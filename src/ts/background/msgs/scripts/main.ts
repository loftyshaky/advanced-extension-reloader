import { t } from '@loftyshaky/shared';
import { s_badge, s_data, s_reload, s_side_effects } from 'background/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (msg_str === 'update_settings') {
            s_data.Main.i()
                .update_settings({
                    settings: msg.settings,
                })
                .then(() => {
                    s_reload.Tabs.i().reload_background_tab_page_tab();
                    s_reload.Tabs.i().open_background_tab();
                })
                .catch((error_obj) => {
                    show_err_ribbon(error_obj, 'aer_1104');
                });
        } else if (msg_str === 'get_defaults') {
            return Promise.resolve(s_data.Main.i().defaults);
        } else if (msg_str === 'reload') {
            s_reload.Watch.i().generate_reload_debounce_and_run_reload_f({
                options: msg.options,
            });
        } else if (msg_str === 'show_badge') {
            s_badge.Main.i().show();
        } else if (msg_str === 'react_to_change') {
            s_side_effects.Main.i().react_to_change();
        }

        return false;
    }, 'aer_1009'),
);
