class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    private open_popup_if_window_is_focused_interval: ReturnType<typeof setInterval> | undefined;
    public interval_timer_is_running: boolean = false;

    public start_open_popup_interval = (): void =>
        err(() => {
            clearInterval(this.open_popup_if_window_is_focused_interval);

            this.open_popup_if_window_is_focused_interval = setInterval(
                this.open_popup_if_window_is_focused,
                250,
            );

            this.interval_timer_is_running = true;
        }, 'aer_1148');

    private open_popup_if_window_is_focused = async (): Promise<void> =>
        err_async(async () => {
            const window_is_focused: boolean = await ext.send_msg_resp({
                msg: 'get_window_focus_state',
            });
            const get_popup_was_open_on_extension_reload: boolean = await ext.send_msg_resp({
                msg: 'get_popup_was_open_on_extension_reload',
            });
            const popup_will_reload_when_window_will_focus: boolean = await ext.send_msg_resp({
                msg: 'get_popup_will_reload_when_window_will_focus',
            });
            const reloading_extensions: boolean = await ext.send_msg_resp({
                msg: 'get_reloading_extensions',
            });

            if (
                window_is_focused &&
                (get_popup_was_open_on_extension_reload ||
                    popup_will_reload_when_window_will_focus) &&
                !reloading_extensions
            ) {
                clearInterval(this.open_popup_if_window_is_focused_interval);
                ext.send_msg({
                    msg: 'open_popup',
                });

                this.interval_timer_is_running = false;
            }
        }, 'aer_1149');
}

export const Popup = Class.get_instance();
