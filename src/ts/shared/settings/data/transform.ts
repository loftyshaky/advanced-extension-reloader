import _ from 'lodash';
import { runInAction } from 'mobx';

import { d_settings } from '@loftyshaky/shared';

export class Transform {
    private static i0: Transform;

    public static i(): Transform {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public set_transformed = ({ settings = undefined }: { settings?: any } = {}): Promise<void> =>
        err_async(async () => {
            let settings_final: any;

            if (_.isEmpty(settings)) {
                const default_settings = await ext.send_msg_resp({ msg: 'get_default_settings' });

                settings_final = default_settings;
            } else {
                settings_final = settings;
            }

            Object.entries(settings_final).forEach(([key, val]): void =>
                err(() => {
                    if (key === 'ports') {
                        settings_final[key] = (val as string[]).join(',');
                    } else if (['click_action', 'context_menu_actions'].includes(key)) {
                        settings_final[key] = JSON.stringify(val, undefined, 4);
                    } else {
                        settings_final[key] = val;
                    }
                }, 'aer_1081'),
            );

            runInAction((): void => {
                data.settings = settings_final;
            });

            ext.send_msg({ msg: 'react_to_change' });
        }, 'aer_1082');

    public set_transformed_from_storage = (): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get();
            const settings_are_corrupt: boolean = !n(settings.enable_cut_features);

            if (_.isEmpty(settings) || settings_are_corrupt) {
                const default_settings = await ext.send_msg_resp({ msg: 'get_default_settings' });

                await ext.storage_set(default_settings);

                await d_settings.Main.i().set({ settings: default_settings, settings_are_corrupt });
            }

            if (!settings_are_corrupt) {
                this.set_transformed({ settings });
            }
        }, 'aer_1083');
}
