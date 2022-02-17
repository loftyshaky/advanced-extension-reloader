import _ from 'lodash';

import { t } from '@loftyshaky/shared';
import { o_schema, d_schema } from '@loftyshaky/shared/settings';
import { i_data } from 'shared/internal';
import { s_reload } from 'background/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public defaults: i_data.Settings | t.EmptyRecord = {};

    public init_defaults = (): void =>
        err(() => {
            this.defaults = {
                current_section: 'reload',
                options_page_theme: 'light',
                transition_duration: 200,
                show_color_help: true,
                enable_cut_features: false,
                ports: ['7220'],
                reload_notification_volume: '1',
                open_background_tab_automatically: true,
                open_position_in_tab_strip: 0,
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
        }, 'aer_1008');

    public update_settings_debounce = _.debounce(
        (settings: i_data.Settings, rerun_actions: boolean = false, transform: boolean = false) =>
            err_async(async () => {
                await this.update_settings({ settings, transform });

                if (rerun_actions) {
                    ext.send_msg_to_all_tabs({ msg: 'rerun_actions' });
                }

                s_reload.Tabs.i().reload_background_tab_page_tab();
                s_reload.Tabs.i().open_background_tab();
            }, 'ges_1177'),
        500,
    );

    public set_from_storage = ({
        transform = false,
    }: { transform?: boolean } = {}): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (_.isEmpty(settings)) {
                await this.update_settings({ transform });
            } else if (transform) {
                await this.update_settings({ settings, transform });
            }
        }, 'aer_1009');

    private transform = ({ settings }: { settings: i_data.Settings }): Promise<i_data.Settings> =>
        err_async(async () => {
            const settings_copy: any = settings;

            const transform_items: o_schema.TransformItem[] = [
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

            const click_action: any = await d_schema.Main.i().transform({
                settings: settings_copy.click_action,
                transform_items,
            });

            settings_copy.click_action = click_action;

            settings_copy.context_menu_actions = await Promise.all(
                settings_copy.context_menu_actions.map((action: any): any =>
                    err_async(async () => {
                        const new_action: any = await d_schema.Main.i().transform({
                            settings: action,
                            transform_items,
                        });

                        return new_action;
                    }, 'aer_1087'),
                ),
            );

            return settings_copy;
        }, 'aer_1085');
}
