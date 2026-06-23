import type { t } from '@loftyshaky/shared/shared';
import { s_data, s_theme } from '@loftyshaky/shared/shared';
import { d_data } from 'settings/internal';
import { d_settings } from 'shared/internal';
import { s_css_vars } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public restore_confirm = (): Promise<void> =>
        err_async(async () => {
            const confirmed_restore: boolean = globalThis.confirm(
                ext.msg('restore_defaults_confirm'),
            );

            if (confirmed_restore) {
                const default_settings = await ext.send_msg_resp({ msg: 'get_defaults' });
                const default_settings_final = s_data.Settings.apply_unchanged_prefs({
                    settings: default_settings as t.AnyRecord,
                });

                await d_data.Manipulation.send_msg_to_update_settings({
                    settings: default_settings_final,
                    replace: true,
                    update_instantly: true,
                    load_settings: true,
                });

                void d_settings.Transform.set_transformed({ settings: data.settings });

                void s_theme.Theme.set({
                    name: data.settings.prefs.options_page_theme,
                });
                s_css_vars.CssVars.set();
            }
        }, 'aer_1049');

    public restore_back_up = ({ data_objs }: { data_objs: t.AnyRecord[] }): Promise<void> =>
        err_async(async () => {
            await d_data.Manipulation.send_msg_to_update_settings({
                settings: data_objs[0],
                replace: true,
                update_instantly: true,
                transform: true,
                transform_force: true,
                load_settings: true,
                restore_back_up: true,
            });
        }, 'aer_1050');

    public restore_back_up_react = (): Promise<void> =>
        err_async(async () => {
            void d_settings.Transform.set_transformed({ settings: data.settings });
            void s_theme.Theme.set({
                name: data.settings.prefs.options_page_theme,
            });
            s_css_vars.CssVars.set();
        }, 'aer_1126');
}

export const Restore = Class.get_instance();
