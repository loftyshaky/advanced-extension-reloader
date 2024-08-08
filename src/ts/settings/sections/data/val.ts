import map from 'lodash/map';
import trim from 'lodash/trim';

import { t } from '@loftyshaky/shared/shared';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { s_settings } from '@loftyshaky/shared/settings';
import { s_css_vars } from 'shared_clean/internal';
import { d_sections } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public change = ({ input }: { input: i_inputs.Input }): void =>
        err(
            () => {
                const raw_val = d_inputs.Val.access({ input });
                let val: t.AnyUndefined;

                if (input.name === 'ports') {
                    val = map((raw_val as string).split(','), trim);
                } else if (d_sections.Validation.check_if_json_input({ name: input.name })) {
                    val = JSON.parse(raw_val as string);
                } else if (n(raw_val)) {
                    val = input.name === 'transition_duration' ? +raw_val : raw_val;

                    s_settings.Theme.change({
                        input,
                        name: val as string,
                    });
                }

                if (!d_sections.Validation.validate_input({ input })) {
                    if (
                        input.name !== 'ports' &&
                        !d_sections.Validation.check_if_json_input({ name: input.name })
                    ) {
                        d_inputs.Val.set({
                            val,
                            input,
                        });
                    }

                    s_css_vars.CssVars.set();

                    ext.send_msg({
                        msg: 'update_settings',
                        settings: { [input.name]: val },
                    });
                }
            },
            'aer_1054',
            { silent: true },
        );

    public remove_val = ({ input }: { input: i_inputs.Input }): Promise<void> =>
        err_async(async () => {
            this.change({ input });
        }, 'aer_1062');

    public enable_developer_mode_save_callback = (): Promise<void> =>
        err_async(async () => {
            await ext.send_msg_resp({
                msg: 'update_settings',
                settings: { developer_mode: data.settings.developer_mode },
                rerun_actions: true,
            });
        }, 'aer_1210');
}

export const Val = Class.get_instance();
