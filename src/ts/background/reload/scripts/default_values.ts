import { i_options } from 'shared/internal';

export class DefaultValues {
    private static i0: DefaultValues;

    public static i(): DefaultValues {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public tranform_reload_action = ({
        reload_action,
    }: {
        reload_action: i_options.Options;
    }): i_options.Options =>
        err(() => {
            const transformed_reload_action: i_options.Options = reload_action;

            if (!n(reload_action.ext_id)) {
                transformed_reload_action.ext_id = undefined;
            }

            if (!n(reload_action.hard)) {
                transformed_reload_action.hard = true;
            }

            if (!n(reload_action.hardfull)) {
                transformed_reload_action.hardfull = false;
            }

            if (!n(reload_action.all_tabs)) {
                transformed_reload_action.all_tabs = false;
            }

            return transformed_reload_action;
        }, 'aer_1049');
}
