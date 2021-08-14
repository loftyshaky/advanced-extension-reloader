import { t } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';
import { s_reload } from 'background_tab/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'upadate_settings_var') {
                await d_settings.Main.i().set_from_storage();
            } else if (msg_str === 'connect_to_ext_servers') {
                s_reload.Watch.i().connect();
            } else if (msg_str === 'play_sound') {
                s_reload.Watch.i().play_sound();
            }

            return true;
        }, 'aer_1009'),
);
