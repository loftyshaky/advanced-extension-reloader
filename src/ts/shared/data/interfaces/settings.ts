import { i_options } from 'shared/internal';

export interface Settings {
    current_section: string;
    options_page_theme: string;
    transition_duration: number;
    show_color_help: boolean;
    enable_cut_features: boolean;
    ports: string[];
    full_reload_timeout: number;
    reload_notification_volume: string;
    click_action: i_options.Options;
    context_menu_actions: i_options.Options[];
}
