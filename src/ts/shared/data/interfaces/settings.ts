import { i_options } from 'shared/internal';

export interface Settings {
    current_section: string;
    options_page_theme: string;
    transition_duration: number;
    show_color_help: boolean;
    developer_mode: boolean;
    enable_cut_features: boolean;
    offers_are_visible: boolean;
    offer_banner_type: 'horizontal' | 'vertical';
    ports: string[];
    reload_notification_volume: string;
    allow_theme_reload: boolean;
    open_background_tab_automatically: boolean;
    open_position_in_tab_strip: number;
    click_action: i_options.Options;
    context_menu_actions: i_options.Options[];
}
