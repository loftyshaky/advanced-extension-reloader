import { i_data } from 'shared_clean/internal';
import { s_reload } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public react_to_change = (): Promise<void> =>
        err_async(async () => {
            // react to settings change or extension reinstall/removal

            const settings: i_data.Settings = await ext.storage_get();

            s_reload.ContextMenu.create();

            ext.send_msg({
                msg: 'connect_to_ext_servers',
                ports: settings.ports,
                reload_notification_volume: settings.reload_notification_volume,
            });
        }, 'aer_1041');
}

export const SideEffects = Class.get_instance();
