import _ from 'lodash';

import { s_reload } from 'background/internal';

export class Settings {
    private static i0: Settings;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    public update = _.debounce((
        { settings }:
        { settings: any },
    ): Promise<void> => err_async(async () => {
        await ext.storage_set(settings);

        s_reload.ContextMenu.i.create();
    },
    1022),
    1000);
}