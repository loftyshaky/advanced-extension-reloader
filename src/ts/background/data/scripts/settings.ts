import { t } from '@loftyshaky/shared/shared_clean';
import { i_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public defaults: i_data.Settings | t.EmptyRecord = {};

    public init_defaults = (): void =>
        err(() => {
            this.defaults = {
                prefs: {
                    version: ext.get_app_version(),
                    current_section: 'reload',
                    options_page_theme: 'lavender',
                    transition_duration: 200,
                    color_help_is_visible: true,
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
                },
            };
        }, 'aer_1007');
}

export const Settings = Class.get_instance();
