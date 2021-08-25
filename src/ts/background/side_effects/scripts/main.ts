import { s_reload } from 'background/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public react_to_change = () =>
        err(() => {
            // react to settings change or extension reinstall/removal
            s_reload.ContextMenu.i().create();
            ext.send_msg({ msg: 'connect_to_ext_servers' });
        }, 'aer_1041');
}

we.management.onUninstalled.addListener((): void =>
    err(() => {
        Main.i().react_to_change();
    }, 'aer_1042'),
);

we.management.onInstalled.addListener((): void =>
    err(() => {
        Main.i().react_to_change();
    }, 'aer_1043'),
);
