import { t } from '@loftyshaky/shared';
import { s_reload } from 'background_tab/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (msg_str === 'connect_to_ext_servers') {
            s_reload.Watch.i().connect();
        } else if (msg_str === 'play_sound') {
            s_reload.Watch.i().play_sound();
        }

        return false;
    }, 'aer_1009'),
);
