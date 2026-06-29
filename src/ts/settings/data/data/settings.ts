import { d_data } from '@loftyshaky/shared/shared';
import { d_settings } from 'shared/internal';
import { s_css_vars } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public set_from_storage = ({ transform }: { transform: boolean }): Promise<void> =>
        err_async(async () => {
            if (transform) {
                await d_settings.Transform.set_transformed_from_storage();
            } else {
                await d_data.Settings.set_from_storage();
            }

            s_css_vars.CssVars.set();
        }, 'aer_1159');
}

export const Settings = Class.get_instance();
