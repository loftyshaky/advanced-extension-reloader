import isArray from 'lodash/isArray';

import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { i_options } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public validate_input = ({ input }: { input: i_inputs.Input }): boolean =>
        err(() => {
            try {
                const raw_val = d_inputs.Val.access({ input });

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
                            'after_reload_delay',
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
                            validate_number_val({ val: reload_obj.after_reload_delay }) &&
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

                    if (isArray(val)) {
                        return val.some((reload_obj: i_options.Options): boolean =>
                            err(() => validate_inner({ reload_obj }), 'aer_1059'),
                        );
                    }

                    return true;
                }

                if (input.name === 'after_reload_delay') {
                    return !/^\d+$/.test(raw_val as string);
                }

                if (input.name === 'transition_duration') {
                    return d_inputs.Val.validate_input({ input });
                }
            } catch (error_obj: any) {
                // needed to display input warn state when provided incorrect JSON in click_action and context_menu_actions inputs
                show_err_ribbon(error_obj, 'aer_1060', { silent: true });
            }

            return this.check_if_json_input({ name: input.name });
        }, 'aer_1061');

    public check_if_json_input = ({ name }: { name: string }): boolean =>
        err(() => ['click_action', 'context_menu_actions'].includes(name), 'aer_1063');
}

export const Validation = Class.get_instance();
