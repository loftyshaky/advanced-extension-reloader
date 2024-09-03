import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

import {
    o_schema,
    d_schema,
    s_data as s_data_loftyshaky_shared_clean,
    s_service_worker,
} from '@loftyshaky/shared/shared_clean';
import { i_data } from 'shared_clean/internal';
import { s_data, s_reload, s_side_effects } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set_from_storage_run_prevented: boolean = false;

    public update_settings = ({
        settings,
        replace = false,
        transform = false,
        transform_force = false,
        load_settings = false,
        restore_back_up = false,
    }: {
        mode?: 'normal' | 'set_from_storage';
        settings?: i_data.Settings;
        replace?: boolean;
        transform?: boolean;
        transform_force?: boolean;
        load_settings?: boolean;
        restore_back_up?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            const settings_2: i_data.Settings = n(settings)
                ? settings
                : (s_data.Settings.defaults as i_data.Settings);

            let settings_final: i_data.Settings = settings_2;

            if (transform) {
                settings_final = await this.transform({
                    settings: settings_2,
                    force: transform_force,
                });

                if (restore_back_up) {
                    settings_final = s_data_loftyshaky_shared_clean.Settings.apply_unchanged_prefs({
                        settings: settings_final,
                    });
                }
            }

            await ext.storage_set(settings_final, replace);
            await s_data_loftyshaky_shared_clean.Cache.set_settings({
                settings: settings_final,
            });
            await s_side_effects.SideEffects.react_to_change();

            if (load_settings) {
                await ext.send_msg_resp({ msg: 'load_settings', restore_back_up });
            }

            s_service_worker.ServiceWorker.make_persistent();
        }, 'aer_1008');

    public update_settings_debounce = debounce(
        (
            settings: i_data.Settings,
            replace: boolean = false,
            transform: boolean = false,
            transform_force: boolean = false,
            load_settings: boolean = false,
            restore_back_up: boolean = false,
        ) =>
            err_async(async () => {
                await this.update_settings({
                    settings,
                    replace,
                    transform,
                    transform_force,
                    load_settings,
                    restore_back_up,
                });

                if (load_settings) {
                    ext.send_msg_to_all_tabs({ msg: 'rerun_actions' });
                }
            }, 'aer_1177'),
        250,
    );

    public set_from_storage = ({
        transform = false,
    }: { transform?: boolean } = {}): Promise<void> =>
        err_async(async () => {
            if (s_reload.Watch.running_pause_or_resume_automatic_reload_f) {
                this.set_from_storage_run_prevented = true;
            } else if (!x.prefs_are_filled() && !x.settings_are_filled()) {
                await this.update_settings({ transform });
            } else if (transform) {
                await this.update_settings({ settings: data.settings, transform });
            }
        }, 'aer_1009');

    public on_init_set_from_storage = (): Promise<void> =>
        err_async(async () => {
            if (!n(data.updating_settings) || !data.updating_settings) {
                await this.set_from_storage({ transform: true });
            }
        }, 'aer_1125');

    private transform = ({
        settings,
        force = false, // true is used when restoring back up to ignore version
    }: {
        settings: i_data.Settings;
        force: boolean;
    }): Promise<i_data.Settings> =>
        err_async(async () => {
            const version = d_schema.Schema.get_version_legacy({ settings });

            const transform_items_settings: o_schema.TransformItem[] = [
                new o_schema.TransformItem({
                    new_key: 'prefs',
                    new_val: cloneDeep(settings),
                }),
                new o_schema.TransformItem({
                    old_key: 'after_reload_delay',
                }),
                new o_schema.TransformItem({
                    old_key: 'current_section',
                }),
                new o_schema.TransformItem({
                    old_key: 'options_page_theme',
                }),
                new o_schema.TransformItem({
                    old_key: 'transition_duration',
                }),
                new o_schema.TransformItem({
                    old_key: 'show_color_help',
                }),
                new o_schema.TransformItem({
                    old_key: 'developer_mode',
                }),
                new o_schema.TransformItem({
                    old_key: 'enable_cut_features',
                }),
                new o_schema.TransformItem({
                    old_key: 'persistent_service_worker',
                }),
                new o_schema.TransformItem({
                    old_key: 'offers_are_visible',
                }),
                new o_schema.TransformItem({
                    old_key: 'ports',
                }),
                new o_schema.TransformItem({
                    old_key: 'reload_notification_volume',
                }),
                new o_schema.TransformItem({
                    old_key: 'allow_theme_reload',
                }),
                new o_schema.TransformItem({
                    old_key: 'pause_automatic_reload',
                }),
                new o_schema.TransformItem({
                    old_key: 'click_action',
                }),
                new o_schema.TransformItem({
                    old_key: 'context_menu_actions',
                }),
            ];

            const updated_settings = await d_schema.Schema.transform({
                data_obj: settings,
                version,
                transform_items: transform_items_settings,
                force,
            });

            const settings_transform_items: o_schema.TransformItem[] = [
                new o_schema.TransformItem({
                    new_key: 'allow_theme_reload',
                    new_val: true,
                }),
                new o_schema.TransformItem({
                    new_key: 'developer_mode',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    new_key: 'offers_are_visible',
                    new_val: true,
                }),
                new o_schema.TransformItem({
                    new_key: 'persistent_service_worker',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    new_key: 'pause_automatic_reload',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    old_key: 'after_reload_delay',
                }),
                new o_schema.TransformItem({
                    old_key: 'show_color_help',
                    new_key: 'color_help_is_visible',
                }),
            ];

            const click_action_transform_items: o_schema.TransformItem[] = [
                new o_schema.TransformItem({
                    old_key: 'after_enable_delay',
                    new_key: 'after_reload_delay',
                    new_val: 1000,
                    create_property_if_it_doesnt_exist: false,
                }),
                new o_schema.TransformItem({
                    old_key: 'full_reload_timeout',
                }),
                new o_schema.TransformItem({
                    old_key: 'play_sound',
                    new_key: 'play_notifications',
                    create_property_if_it_doesnt_exist: false,
                }),
            ];

            const updated_prefs: i_data.Prefs = await d_schema.Schema.transform({
                data_obj: updated_settings.prefs,
                version,
                transform_items: settings_transform_items,
                keys_to_remove: ['open_background_tab_automatically', 'open_position_in_tab_strip'],
                force,
            });

            const click_action: any = await d_schema.Schema.transform({
                data_obj: updated_prefs.click_action,
                version,
                transform_items: click_action_transform_items,
                force,
            });

            updated_prefs.click_action = click_action;

            updated_prefs.context_menu_actions = await Promise.all(
                updated_prefs.context_menu_actions.map((action: any): any =>
                    err_async(async () => {
                        const new_action: any = await d_schema.Schema.transform({
                            data_obj: action,
                            version,
                            transform_items: click_action_transform_items,
                            force,
                        });

                        return new_action;
                    }, 'aer_1087'),
                ),
            );

            updated_prefs.version = ext.get_app_version();

            settings.prefs = updated_prefs;

            await d_schema.Schema.replace({ settings });

            return settings;
        }, 'aer_1085');
}

export const Manipulation = Class.get_instance();
