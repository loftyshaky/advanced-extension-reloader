import _ from 'lodash';
import { runInAction } from 'mobx';

import { t } from '@loftyshaky/shared';
import { i_data } from 'shared/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public allow_rerun_actions = true;

    private set = ({ settings }: { settings?: i_data.Settings } = {}): Promise<void> =>
        err_async(async () => {
            let settings_final: i_data.Settings;

            if (n(settings)) {
                if (_.isEmpty(settings)) {
                    const default_settings = await ext.send_msg_resp({ msg: 'get_defaults' });

                    settings_final = default_settings;
                } else {
                    settings_final = settings;
                }
            }

            runInAction(() =>
                err(() => {
                    data.settings = settings_final;
                }, 'aer_1163'),
            );
        }, 'aer_1164');

    public change = ({ key, val }: { key: string; val: t.AnyUndefined }): void =>
        err(() => {
            data.settings[key] = val;

            this.allow_rerun_actions = false;

            ext.send_msg_resp({
                msg: 'update_settings',
                settings: { [key]: val },
                rerun_actions: true,
            });
        }, 'aer_1165');
}