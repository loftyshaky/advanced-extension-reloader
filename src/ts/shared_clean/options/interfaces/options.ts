export interface Options {
    all_tabs?: boolean;
    hard?: boolean;
    play_notifications?: boolean;
    extension_id?: string;
    min_interval_between_extension_reloads?: number;
    delay_after_extension_reload?: number;
    delay_after_tab_reload?: number;
    listen_message_response_timeout?: number;
}
