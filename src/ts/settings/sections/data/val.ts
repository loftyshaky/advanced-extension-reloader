import _ from 'lodash';

import { t } from '@loftyshaky/shared';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { s_settings } from '@loftyshaky/shared/settings';
import { s_css_vars, i_options } from 'shared/internal';

export class Val {
    private static i0: Val;

    public static i(): Val {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public change = ({ input }: { input: i_inputs.Input }): void =>
        err(() => {
            try {
                const raw_val = d_inputs.Val.i().access({ input });
                let val: t.AnyUndefined;

                if (input.name === 'ports') {
                    val = _.map((raw_val as string).split(','), _.trim);
                } else if (this.check_if_json_input({ name: input.name })) {
                    val = JSON.parse(raw_val as string);
                } else if (n(raw_val)) {
                    val = [
                        'transition_duration',
                        'full_reload_timeout',
                        'open_position_in_tab_strip',
                    ].includes(input.name)
                        ? +raw_val
                        : raw_val;

                    s_settings.Theme.i().change({
                        input,
                        name: val as string,
                    });
                }

                if (!this.validate_input({ input })) {
                    if (input.name !== 'ports' && !this.check_if_json_input({ name: input.name })) {
                        d_inputs.Val.i().set({
                            val,
                            input,
                        });
                    }

                    s_css_vars.Main.i().set();

                    this.update_settings_debounce({ input, val });
                }
            } catch (error_obj: any) {
                show_err_ribbon(error_obj, 'aer_1053', { silent: true });
            }
        }, 'aer_1054');

    public validate_input = ({ input }: { input: i_inputs.Input }): boolean =>
        err(() => {
            try {
                const raw_val = d_inputs.Val.i().access({ input });

                const validate_inner = ({
                    reload_obj,
                }: {
                    reload_obj: i_options.Options;
                }): boolean =>
                    err(() => {
                        const validate_bool_val = ({
                            val,
                        }: {
                            val: boolean | undefined;
                        }): boolean => err(() => !n(val) || typeof val === 'boolean', 'aer_1055');

                        const validate_number_val = ({
                            val,
                        }: {
                            val: number | undefined;
                        }): boolean =>
                            err(
                                () =>
                                    !n(val) ||
                                    (typeof val === 'number' && /^\d+$/.test(val.toString())),
                                'aer_1056',
                            );

                        const allowed_keys: string[] = [
                            'hard',
                            'all_tabs',
                            'ext_id',
                            'play_sound',
                            'after_enable_delay',
                            'full_reload_timeout',
                        ];
                        const reload_obj_keys: string[] = Object.keys(reload_obj);

                        const reload_obj_has_only_allowed_els: boolean = reload_obj_keys.every(
                            (key: string): boolean =>
                                err(() => allowed_keys.includes(key), 'aer_1057'),
                        );

                        return !(
                            reload_obj_has_only_allowed_els &&
                            validate_bool_val({ val: reload_obj.hard }) &&
                            validate_bool_val({ val: reload_obj.all_tabs }) &&
                            validate_bool_val({ val: reload_obj.play_sound }) &&
                            validate_number_val({ val: reload_obj.full_reload_timeout }) &&
                            (!n(reload_obj.ext_id) ||
                                (typeof reload_obj.ext_id === 'string' &&
                                    /^[a-z]+$/.test(reload_obj.ext_id)))
                        );
                    }, 'aer_1058');

                if (input.name === 'ports') {
                    return !/^\d+( *?, *?\d+)*$/.test(raw_val as string);
                }

                if (input.name === 'click_action') {
                    const val = JSON.parse(raw_val as string);

                    return validate_inner({ reload_obj: val });
                }

                if (input.name === 'context_menu_actions') {
                    const val = JSON.parse(raw_val as string);

                    if (_.isArray(val)) {
                        return val.some((reload_obj: i_options.Options): boolean =>
                            err(() => validate_inner({ reload_obj }), 'aer_1059'),
                        );
                    }

                    return true;
                }

                if (['full_reload_timeout', 'open_position_in_tab_strip'].includes(input.name)) {
                    return !/^\d+$/.test(raw_val as string);
                }

                if (input.name === 'transition_duration') {
                    return d_inputs.Val.i().validate_input({ input });
                }
            } catch (error_obj: any) {
                show_err_ribbon(error_obj, 'aer_1060', { silent: true });
            }

            return this.check_if_json_input({ name: input.name });
        }, 'aer_1061');

    public remove_val = ({ input }: { input: i_inputs.Input }): Promise<void> =>
        err_async(async () => {
            this.change({ input });
        }, 'aer_1062');

    private check_if_json_input = ({ name }: { name: string }): boolean =>
        err(() => ['click_action', 'context_menu_actions'].includes(name), 'aer_1063');

    private update_settings_debounce = _.debounce(
        ({ input, val }: { input: i_inputs.Input; val: t.AnyUndefined }): void =>
            err(() => {
                ext.send_msg({
                    msg: 'update_settings',
                    settings: { [input.name]: val },
                });
            }, 'aer_1064'),
        500,
    );
}
