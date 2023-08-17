import { i_data } from 'shared/internal';
import { s_reload } from 'background/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public react_to_change = (): Promise<void> =>
        err_async(async () => {
            // react to settings change or extension reinstall/removal

            const settings: i_data.Settings = await ext.storage_get();

            s_reload.ContextMenu.i().create();

            ext.send_msg({
                msg: 'connect_to_ext_servers',
                ports: settings.ports,
                reload_notification_volume: settings.reload_notification_volume,
            });
        }, 'aer_1041');
}

we.management.onUninstalled.addListener(
    (): Promise<void> =>
        err_async(async () => {
            await Main.i().react_to_change();
        }, 'aer_1042'),
);

we.management.onInstalled.addListener(
    (): Promise<void> =>
        err_async(async () => {
            await Main.i().react_to_change();
        }, 'aer_1043'),
);
