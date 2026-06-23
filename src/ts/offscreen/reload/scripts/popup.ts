class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

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
            const window_is_focused: unknown = await ext.send_msg_resp({
                msg: 'get_window_focus_state',
            });
            const get_popup_was_open_on_extension_reload: unknown = await ext.send_msg_resp({
                msg: 'get_popup_was_open_on_extension_reload',
            });
            const popup_will_reload_when_window_will_focus: unknown = await ext.send_msg_resp({
                msg: 'get_popup_will_reload_when_window_will_focus',
            });
            const reloading_extensions: unknown = await ext.send_msg_resp({
                msg: 'get_reloading_extensions',
            });

            const window_is_focused_final: boolean =
                typeof window_is_focused === 'boolean' ? window_is_focused : false;
            const get_popup_was_open_on_extension_reload_final: boolean =
                typeof get_popup_was_open_on_extension_reload === 'boolean'
                    ? get_popup_was_open_on_extension_reload
                    : false;
            const popup_will_reload_when_window_will_focus_final: boolean =
                typeof popup_will_reload_when_window_will_focus === 'boolean'
                    ? popup_will_reload_when_window_will_focus
                    : false;
            const reloading_extensions_final: boolean =
                typeof reloading_extensions === 'boolean' ? reloading_extensions : false;

            if (
                window_is_focused_final &&
                (get_popup_was_open_on_extension_reload_final ||
                    popup_will_reload_when_window_will_focus_final) &&
                !reloading_extensions_final
            ) {
                clearInterval(this.open_popup_if_window_is_focused_interval);
                void ext.send_msg({
                    msg: 'open_popup',
                });

                this.interval_timer_is_running = false;
            }
        }, 'aer_1149');
}

export const Popup = Class.get_instance();
