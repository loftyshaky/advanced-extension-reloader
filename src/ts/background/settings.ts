import _ from 'lodash';

import { s_reload } from 'background/internal';

export class Settings {
    private static i0: Settings;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    public default_settings: any = {
        ports: ['7220'],
        click_action: {
            all_tabs: false,
            hard: true,
        },
        reload_actions: [
            {
                all_tabs: false,
                hard: true,
            },
            {
                all_tabs: true,
                hard: true,
            },
            {
                all_tabs: false,
                hard: false,
            },
            {
                all_tabs: true,
                hard: false,
            },
        ],
    }

    public update = (
        { settings }:
        { settings?: any } = {},
    ): Promise<void> => err_async(async () => {
        const settings_final: any = n(settings)
            ? settings
            : this.default_settings;

        await ext.storage_set(settings_final);

        this.react_to_settings_change_or_load();
    },
    1036);

    public update_debounced = _.debounce((
        { settings }:
        { settings: any },
    ): void => { this.update({ settings }); },
    1000);

    public react_to_settings_change_or_load =() => err(() => {
        s_reload.ContextMenu.i.create();
        s_reload.Watch.i.connect();
    },
    1039);

    public set_from_storage = (): Promise<void> => err_async(async () => {
        const settings = await ext.storage_get();

        if (_.isEmpty(settings)) {
            this.update();
        } else {
            this.react_to_settings_change_or_load();
        }
    },
    1038);
}
