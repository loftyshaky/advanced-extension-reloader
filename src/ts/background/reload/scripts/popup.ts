import { Windows } from 'webextension-polyfill';

import { i_options } from 'shared_clean/internal';
import { s_reload } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public try_to_reload = async ({
        options,
    }: { options?: i_options.Options } = {}): Promise<void> =>
        err_async(async () => {
            if (
                n(options) &&
                n(options.extension_id) &&
                n(options.always_open_popup) &&
                (options.always_open_popup ||
                    (n(data.popup_will_reload_when_window_will_focus) &&
                        data.popup_will_reload_when_window_will_focus) ||
                    data.popup_was_open_on_extension_reload)
            ) {
                const window_is_focused: boolean = await this.get_window_focus_state();

                if (window_is_focused && !s_reload.Watch.reloading_extensions) {
                    await this.reload({
                        extension_id: options.extension_id,
                    });
                } else {
                    ext.send_msg({ msg: 'start_open_popup_interval' });
                }
            }
        }, 'aer_1146');

    public reload = async ({ extension_id }: { extension_id?: string } = {}): Promise<void> =>
        err_async(async () => {
            const extension_id_final: string | undefined = n(extension_id)
                ? extension_id
                : data.extension_id;

            await we.runtime.sendMessage(extension_id_final, {
                msg: 'open_popup',
            });

            data.open_popup = undefined;
            data.popup_will_reload_when_window_will_focus = undefined;
            data.popup_was_open_on_extension_reload = undefined;

            await we.storage.session.remove([
                'extension_id',
                'popup_will_reload_when_window_will_focus',
                'popup_was_open_on_extension_reload',
            ]);
        }, 'aer_1145');

    public get_window_focus_state = async (): Promise<boolean> =>
        err_async(async () => {
            const last_focused_window: Windows.Window = await we.windows.getLastFocused();

            return last_focused_window.focused;
        }, 'aer_1147');

    public set_reload_session_vals = async ({
        options,
    }: {
        options?: i_options.Options;
    }): Promise<void> =>
        err_async(async () => {
            const window_is_focused: boolean = await this.get_window_focus_state();

            if (n(options) && (!window_is_focused || s_reload.Watch.reloading_extensions)) {
                data.extension_id =
                    !n(data.extension_id) || options.always_open_popup
                        ? options.extension_id
                        : data.extension_id;
                data.popup_will_reload_when_window_will_focus =
                    !n(data.popup_will_reload_when_window_will_focus) || options.always_open_popup
                        ? options.always_open_popup
                        : data.popup_will_reload_when_window_will_focus;

                await we.storage.session.set({
                    extension_id: data.extension_id,
                    popup_will_reload_when_window_will_focus:
                        data.popup_will_reload_when_window_will_focus,
                });
            }
        }, 'aer_1151');

    public set_popup_was_open_on_extension_reload = async ({
        options,
    }: {
        options?: i_options.Options;
    }): Promise<void> =>
        err_async(async () => {
            if (n(options)) {
                const popup_is_open: boolean = await we.runtime.sendMessage(options.extension_id, {
                    msg: 'check_if_popup_is_open',
                });
                const popup_is_open_final: boolean = n(popup_is_open) ? popup_is_open : false;

                data.popup_was_open_on_extension_reload = data.popup_was_open_on_extension_reload
                    ? data.popup_was_open_on_extension_reload
                    : popup_is_open_final;

                await we.storage.session.set({
                    popup_was_open_on_extension_reload: data.popup_was_open_on_extension_reload,
                });
            }
        }, 'aer_1151');
}

export const Popup = Class.get_instance();
