import { t } from '@loftyshaky/shared';
import { s_reload } from 'offscreen/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'connect_to_ext_servers') {
                s_reload.Watch.i().connect({
                    ports: msg.ports,
                    reload_notification_volume: msg.reload_notification_volume,
                });
            } else if (msg_str === 'play_reload_sound') {
                s_reload.Watch.i().play_sound({
                    notification_type: 'reload',
                    reload_notification_volume: msg.reload_notification_volume,
                });
            } else {
                await x.delay(10000);
            }

            return false;
        }, 'aer_1001'),
);
