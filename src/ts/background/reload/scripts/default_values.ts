import { i_shared } from 'shared/internal';

export class DefaultValues {
    private static i0: DefaultValues;

    public static get i() {
        if (!this.i0) {
            this.i0 = new this();
        }

        return this.i0;
    }

    public tranform_reload_action = ({
        reload_action,
    }: {
        reload_action: i_shared.Options;
    }): i_shared.Options =>
        err(() => {
            const transformed_reload_action: i_shared.Options = reload_action;

            if (!n(reload_action.ext_id)) {
                transformed_reload_action.ext_id = false;
            }

            if (!n(reload_action.hard)) {
                transformed_reload_action.hard = true;
            }

            if (!n(reload_action.all_tabs)) {
                transformed_reload_action.all_tabs = false;
            }

            return transformed_reload_action;
        }, 1049);
}
