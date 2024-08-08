import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

import { t, o_schema, d_schema, s_service_worker } from '@loftyshaky/shared/shared_clean';
import { i_data } from 'shared_clean/internal';
import { s_reload, s_side_effects } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public defaults: i_data.Settings | t.EmptyRecord = {};
    public set_from_storage_run_prevented: boolean = false;

    public init_defaults = (): void =>
        err(() => {
            this.defaults = {
                current_section: 'reload',
                options_page_theme: 'lavender',
                transition_duration: 200,
                show_color_help: true,
                developer_mode: false,
                enable_cut_features: false,
                persistent_service_worker: false,
                offers_are_visible: true,
                ports: ['7220'],
                reload_notification_volume: '1',
                allow_theme_reload: true,
                suspend_automatic_reload: false,
                click_action: {
                    all_tabs: false,
                    hard: true,
                },
                context_menu_actions: [
                    {
                        all_tabs: false,
                        hard: true,
                    },
                    {
                        all_tabs: true,
                        hard: true,
                    },
                    {
                        all_tabs: false,
                        hard: false,
                    },
                    {
                        all_tabs: true,
                        hard: false,
                    },
                ],
            };
        }, 'aer_1007');

    public update_settings = ({
        settings,
        transform = false,
    }: {
        settings?: i_data.Settings;
        transform?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            const settings_2: i_data.Settings = n(settings)
                ? settings
                : (this.defaults as i_data.Settings);

            let settings_final: i_data.Settings = settings_2;

            if (transform) {
                settings_final = await this.transform({ settings: settings_2 });
            }

            await ext.storage_set(settings_final);
            await s_side_effects.SideEffects.react_to_change();

            s_service_worker.ServiceWorker.make_persistent();
        }, 'aer_1008');

    public update_settings_debounce = debounce(
        (settings: i_data.Settings, rerun_actions: boolean = false, transform: boolean = false) =>
            err_async(async () => {
                await this.update_settings({ settings, transform });

                if (rerun_actions) {
                    ext.send_msg_to_all_tabs({ msg: 'rerun_actions' });
                }
            }, 'aer_1177'),
        500,
    );

    public set_from_storage = ({
        transform = false,
    }: { transform?: boolean } = {}): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (s_reload.Watch.running_suspend_or_resume_automatic_reload_f) {
                this.set_from_storage_run_prevented = true;
            } else if (isEmpty(settings)) {
                await this.update_settings({ transform });
            } else if (transform) {
                await this.update_settings({ settings, transform });
            }
        }, 'aer_1009');

    private transform = ({ settings }: { settings: i_data.Settings }): Promise<i_data.Settings> =>
        err_async(async () => {
            const settings_copy: any = settings;

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
                    new_key: 'suspend_automatic_reload',
                    new_val: false,
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
            ];

            const settings_copy_final: i_data.Settings = await d_schema.Schema.transform({
                data: settings_copy,
                transform_items: settings_transform_items,
                remove_from_storage: false,
                keys_to_remove: ['open_background_tab_automatically', 'open_position_in_tab_strip'],
            });

            const click_action: any = await d_schema.Schema.transform({
                data: settings_copy_final.click_action,
                transform_items: click_action_transform_items,
            });

            settings_copy_final.click_action = click_action;

            settings_copy_final.context_menu_actions = await Promise.all(
                settings_copy_final.context_menu_actions.map((action: any): any =>
                    err_async(async () => {
                        const new_action: any = await d_schema.Schema.transform({
                            data: action,
                            transform_items: click_action_transform_items,
                        });

                        return new_action;
                    }, 'aer_1087'),
                ),
            );

            return settings_copy_final;
        }, 'aer_1085');
}

export const Data = Class.get_instance();
