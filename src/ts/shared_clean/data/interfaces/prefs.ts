import { i_options } from 'shared_clean/internal';

export interface Prefs {
    version: string;
    current_section: string;
    options_page_theme: string;
    transition_duration: number;
    color_help_is_visible: boolean;
    developer_mode: boolean;
    enable_cut_features: boolean;
    persistent_service_worker: boolean;
    offers_are_visible: boolean;
    ports: string[];
    reload_notification_volume: string;
    allow_theme_reload: boolean;
    pause_automatic_reload: boolean;
    click_action: i_options.Options;
    context_menu_actions: i_options.Options[];
}
