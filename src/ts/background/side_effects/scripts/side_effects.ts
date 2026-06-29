import { s_data as s_data_loftyshaky_shared_clean } from '@loftyshaky/shared/shared_clean';
import { s_data, s_reload } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public react_to_change = (): Promise<void> =>
        err_async(async () => {
            if (!n(data.settings.prefs)) {
                s_data.Settings.init_defaults();
                await s_data_loftyshaky_shared_clean.Cache.set_data();
                await s_data.Manipulation.on_init_set_from_storage();
            }

            // react to settings change or extension reinstall/removal
            void s_reload.ContextMenu.create();

            if (env.browser === 'firefox') {
                const { s_reload } = await import('offscreen/internal');

                await s_reload.Watch.connect({
                    ports: data.settings.prefs.ports,
                    reload_notification_volume: data.settings.prefs.reload_notification_volume,
                });
            } else {
                void ext.send_msg({
                    msg: 'connect_to_ext_servers',
                    ports: data.settings.prefs.ports,
                    reload_notification_volume: data.settings.prefs.reload_notification_volume,
                });
            }
        }, 'aer_1041');
}

export const SideEffects = Class.get_instance();
