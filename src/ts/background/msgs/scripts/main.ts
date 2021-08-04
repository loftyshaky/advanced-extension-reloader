import { t, s_utils } from '@loftyshaky/shared';
import { s_badge, s_data, s_reload, s_side_effects } from 'background/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'update_settings') {
                await s_data.Main.i().update_settings({
                    settings: msg.settings,
                });

                s_reload.Tabs.i().reload_background_tab_page_tab();
            } else if (msg_str === 'get_defaults') {
                return s_data.Main.i().defaults;
            } else if (msg_str === 'reload') {
                s_reload.Watch.i().reload(msg.options);
            } else if (msg_str === 'show_badge') {
                s_badge.Main.i().show();
            } else if (msg_str === 'react_to_change') {
                s_side_effects.Main.i().react_to_change();
            }

            s_utils.Main.i().reload_ext({ msg: msg_str });

            return true;
        }, 'aer_1009'),
);
