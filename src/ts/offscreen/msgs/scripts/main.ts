import { t } from '@loftyshaky/shared/shared_clean';
import { s_reload } from 'offscreen/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (msg_str === 'connect_to_ext_servers') {
            s_reload.Watch.i().connect({
                ports: msg.ports,
                reload_notification_volume: msg.reload_notification_volume,
            });

            return Promise.resolve(true);
        }

        if (msg_str === 'play_reload_sound') {
            s_reload.Watch.i().play_sound({
                notification_type: 'reload',
                reload_notification_volume: msg.reload_notification_volume,
                ext_id: msg.ext_id,
            });

            return Promise.resolve(true);
        }

        return false;
    }, 'aer_1001'),
);
