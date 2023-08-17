import { t } from '@loftyshaky/shared';
import { s_badge, s_data, s_reload, s_side_effects } from 'background/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'reload_ext') {
                we.runtime.reload();
            } else if (msg_str === 'update_settings') {
                s_data.Main.i().update_settings_debounce(
                    msg.settings,
                    n(msg.rerun_actions) ? msg.rerun_actions : false,
                    n(msg.transform) ? msg.transform : false,
                );
            } else if (msg_str === 'get_defaults') {
                return s_data.Main.i().defaults;
            } else if (msg_str === 'reload') {
                s_reload.Watch.i().try_to_reload({
                    options: msg.options,
                });
            } else if (msg_str === 'show_badge') {
                s_badge.Main.i().show_ok_badge();
            } else if (msg_str === 'react_to_change') {
                await s_side_effects.Main.i().react_to_change();
            } else {
                await x.delay(10000);
            }

            return false;
        }, 'aer_1012'),
);
