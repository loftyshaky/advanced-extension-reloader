import { i_options } from 'shared/internal';

export interface Settings {
    current_section: string;
    options_page_theme: string;
    transition_duration: number;
    show_color_help: boolean;
    developer_mode: boolean;
    enable_cut_features: boolean;
    persistent_service_worker: boolean;
    offers_are_visible: boolean;
    ports: string[];
    reload_notification_volume: string;
    allow_theme_reload: boolean;
    suspend_automatic_reload: boolean;
    click_action: i_options.Options;
    context_menu_actions: i_options.Options[];
}
