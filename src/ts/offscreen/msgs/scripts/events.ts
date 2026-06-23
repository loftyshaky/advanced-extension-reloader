import type { t } from '@loftyshaky/shared/shared_clean';
import { s_reload } from 'offscreen/internal';

we.runtime.onMessage.addListener(
    (msg: t.Any): t.Any =>
        err(() => {
            const msg_str: string = msg.msg;

            if (msg_str === 'connect_to_ext_servers') {
                void s_reload.Watch.connect({
                    ports: msg.ports,
                    reload_notification_volume: msg.reload_notification_volume,
                });

                return Promise.resolve(true);
            }

            if (msg_str === 'play_reload_notification') {
                void s_reload.Watch.play_notification({
                    notification_type: 'reload',
                    reload_notification_volume: msg.reload_notification_volume,
                    extension_id: msg.extension_id,
                    at_least_one_extension_reloaded: msg.at_least_one_extension_reloaded,
                });

                return Promise.resolve(true);
            }

            if (msg_str === 'start_open_popup_interval') {
                s_reload.Popup.start_open_popup_interval();
            }

            return false;
        }, 'aer_1001'),
);
