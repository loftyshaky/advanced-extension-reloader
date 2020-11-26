import _ from 'lodash';
import {
    configure,
    action,
} from 'mobx';

import { i_shared } from 'shared/internal';

import {
    i_inputs,
} from '@loftyshaky/shared/inputs';
import { d_sections } from 'settings/internal';

configure({ enforceActions: 'observed' });

export class Val {
    private static i0: Val;

    public static get i() {
        this.i0 = new this();

        return this.i0;
    }

    public change = (
        {
            input,
        }: {
            input: i_inputs.Input;
        },
    ): void => err(() => {
        if (n(input.val)) {
            try {
                const val = JSON.parse(input.val);

                if (!this.validate_input({ input })) {
                    ext.send_msg(
                        {
                            msg: 'update_setting',
                            settings: { [input.name]: val },
                        },
                    );
                }
            } catch (error_obj) {
                show_err_ribbon(
                    error_obj,
                    1016,
                    { silent: true },
                );
            }
        }
    },
    1014);

    public set_on_page_load = (): Promise<void> => err_async(async () => {
        const settings = await ext.storage_get();

        Object.entries(settings).forEach(action(([
            key,
            val,
        ]) => {
            d_sections.Main.i.sections.settings.inputs[key].val = JSON.stringify(
                val,
                undefined,
                4,
            );
        }));
    },
    1015);

    public validate_input = ({ input }: {input: i_inputs.Input; }): boolean => err(() => {
        if (n(input.val)) {
            try {
                const val = JSON.parse(input.val);

                const validate_inner = (
                    { reload_obj }:
                    { reload_obj: i_shared.Reload },
                ): boolean => err(() => !(
                    _.isObject(reload_obj)
                    && _.size(reload_obj) === 2
                    && n(reload_obj.all_tabs)
                    && n(reload_obj.hard)
                    && typeof reload_obj.all_tabs === 'boolean'
                    && typeof reload_obj.hard === 'boolean'
                ),
                1018);

                if (input.name === 'click_action') {
                    return validate_inner({ reload_obj: val });
                } if (input.name === 'reload_actions') {
                    if (_.isArray(val)) {
                        return val.some((reload_obj: i_shared.Reload): boolean => err(() => (
                            validate_inner({ reload_obj })
                        ),
                        1019));
                    }

                    return true;
                }
            } catch (error_obj) {
                show_err_ribbon(
                    error_obj,
                    1016,
                    { silent: true },
                );
            }
        }

        return true;
    },
    1017);
}
