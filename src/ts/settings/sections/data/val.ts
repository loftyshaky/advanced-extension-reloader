import map from 'lodash/map';
import trim from 'lodash/trim';

import { t } from '@loftyshaky/shared/shared';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { s_sections } from '@loftyshaky/shared/settings';
import { s_css_vars } from 'shared_clean/internal';
import { d_data, d_sections } from 'settings/internal';

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

                    s_sections.Theme.change({
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

                    d_data.Manipulation.send_msg_to_update_settings({
                        settings: { prefs: { ...data.settings.prefs, [input.name]: val } },
                        load_settings: n(input.val_accessor),
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
            await d_data.Manipulation.send_msg_to_update_settings({
                settings: {
                    prefs: {
                        ...data.settings.prefs,
                        developer_mode: data.settings.prefs.developer_mode,
                    },
                },
            });
        }, 'aer_1210');
}

export const Val = Class.get_instance();
