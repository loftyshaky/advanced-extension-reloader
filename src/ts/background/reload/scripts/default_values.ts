import cloneDeep from 'lodash/cloneDeep';
import { i_options } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public tranform_reload_action = ({
        reload_action,
    }: {
        reload_action: i_options.Options;
    }): i_options.Options =>
        err(() => {
            const transformed_reload_action: i_options.Options = cloneDeep(reload_action); // cloneDeep prevents the storage from being overwritten with the values below

            if (!n(reload_action.ext_id)) {
                transformed_reload_action.ext_id = undefined;
            }

            if (!n(reload_action.hard)) {
                transformed_reload_action.hard = true;
            }

            if (!n(reload_action.all_tabs)) {
                transformed_reload_action.all_tabs = false;
            }

            if (!n(reload_action.play_notifications)) {
                transformed_reload_action.play_notifications = false;
            }

            if (!n(reload_action.after_reload_delay)) {
                transformed_reload_action.after_reload_delay = 1000;
            }

            return transformed_reload_action;
        }, 'aer_1019');
}

export const DefaultValues = Class.get_instance();
