import _ from 'lodash';
import { runInAction } from 'mobx';

export class Settings {
    private static i0: Settings;

    public static get i() {
        this.i0 = new this();

        return this.i0;
    }

    private restore = ({ settings }: { settings?: any } = {}): void =>
        err(() => {
            this.set_transformed({ settings });

            ext.send_msg({
                msg: 'update_setting',
                settings,
            });
        }, 1037);

    public restore_confirm = ({ settings }: { settings?: any } = {}): void =>
        err(() => {
            // eslint-disable-next-line no-alert
            const confirmed_restore: boolean = window.confirm(ext.msg('restore_defaults_confirm'));

            if (confirmed_restore) {
                this.restore({ settings });
            }
        }, 1037);

    public set_transformed = ({ settings }: { settings?: any } = {}): Promise<void> =>
        err_async(async () => {
            let settings_final: any;

            if (_.isEmpty(settings)) {
                const default_settings = await ext.send_msg_resp({ msg: 'get_defaults' });

                settings_final = default_settings;
            } else {
                settings_final = settings;
            }

            Object.entries(settings_final).forEach(([key, val]) => {
                settings_final[key] =
                    key === 'ports'
                        ? (val as string[]).join(',')
                        : JSON.stringify(val, undefined, 4);
            });

            runInAction((): void => {
                data.settings = settings_final;
            });

            ext.send_msg({ msg: 'react_to_change' });
        }, 1015);

    public set_transformed_from_storage = (): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get();

            if (_.isEmpty(settings)) {
                const default_settings = await ext.send_msg_resp({ msg: 'get_defaults' });

                await ext.storage_set(default_settings);
            }

            this.set_transformed({ settings });
        }, 1038);

    public restore_back_up = ({ data_obj }: { data_obj: any }): void =>
        err(() => {
            const data_obj_clone: any = _.cloneDeep(data_obj);

            this.set_transformed({ settings: data_obj });

            ext.send_msg({
                msg: 'update_setting',
                settings: data_obj_clone,
            });
        }, 1041);
}
