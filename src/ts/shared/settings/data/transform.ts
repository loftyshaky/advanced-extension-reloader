import isEmpty from 'lodash/isEmpty';
import { runInAction } from 'mobx';

import { d_data } from '@loftyshaky/shared/shared';
import type { t } from '@loftyshaky/shared/shared_clean';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public set_transformed = ({ settings }: { settings?: t.AnyRecord } = {}): Promise<void> =>
        err_async(async () => {
            const settings_final = settings;

            if (!isEmpty(settings_final) && !isEmpty(settings_final.prefs)) {
                Object.entries(settings_final.prefs).forEach(([key, val]: [string, t.Any]): void =>
                    err(() => {
                        runInAction(() =>
                            err(() => {
                                if (key === 'ports') {
                                    data.ui[key] = (val as string[]).join(', ');
                                } else if (['click_action', 'context_menu_actions'].includes(key)) {
                                    data.ui[key] = JSON.stringify(val, undefined, 4);
                                }
                            }, 'aer_1116'),
                        );
                    }, 'aer_1081'),
                );

                void ext.send_msg({ msg: 'react_to_change' });
            }
        }, 'aer_1082');

    public set_transformed_from_storage = (): Promise<void> =>
        err_async(async () => {
            await d_data.Settings.set_from_storage();

            if (x.prefs_are_filled()) {
                void this.set_transformed({ settings: data.settings });
            }
        }, 'aer_1083');
}

export const Transform = Class.get_instance();
