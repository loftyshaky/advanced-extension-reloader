import { d_data, s_theme } from '@loftyshaky/shared/shared';
import { d_settings } from 'shared/internal';
import { s_css_vars } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set_from_storage = ({ transform = false }: { transform: boolean }): Promise<void> =>
        err_async(async () => {
            if (transform) {
                await d_settings.Transform.set_transformed_from_storage();
            } else {
                d_data.Settings.set_from_storage();
            }

            s_theme.Theme.set({
                name: data.settings.prefs.options_page_theme,
            });
            s_css_vars.CssVars.set();
        }, 'cot_1035');
}

export const Settings = Class.get_instance();
