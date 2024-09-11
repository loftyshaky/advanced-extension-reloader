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

            if (!n(reload_action.extension_id)) {
                transformed_reload_action.extension_id = undefined;
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

            if (!n(reload_action.min_interval_between_extension_reloads)) {
                transformed_reload_action.min_interval_between_extension_reloads = 500;
            }

            if (!n(reload_action.delay_after_extension_reload)) {
                transformed_reload_action.delay_after_extension_reload = 1000;
            }

            if (!n(reload_action.delay_after_tab_reload)) {
                transformed_reload_action.delay_after_tab_reload = 2000;
            }

            if (!n(reload_action.listen_message_response_timeout)) {
                transformed_reload_action.listen_message_response_timeout = 400;
            }

            return transformed_reload_action;
        }, 'aer_1019');
}

export const DefaultValues = Class.get_instance();
