import { Tabs, Management } from 'webextension-polyfill';

import { t } from '@loftyshaky/shared/shared_clean';
import { s_reload as s_reload_shared, s_suffix, i_options } from 'shared_clean/internal';
import { s_badge, s_data, s_reload } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    private reloading: boolean = false;
    private allow_fast_reload: boolean = true;
    private debounce_reload_timer: number = 0;
    private reload_cooldown_timer: number = 0;
    private full_reload_delay: number = 1000;
    public last_cooldown_time = 0;
    public reload_cooldown_timer_start_timestamp = 0;
    public running_suspend_or_resume_automatic_reload_f: boolean = false;

    public try_to_reload = ({
        options,
        automatic_reload = false,
    }: {
        options: i_options.Options;
        automatic_reload?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            if (
                !automatic_reload ||
                (automatic_reload && !data.settings.prefs.suspend_automatic_reload)
            ) {
                globalThis.clearTimeout(this.reload_cooldown_timer);
                globalThis.clearTimeout(this.debounce_reload_timer);

                if (!this.reloading) {
                    this.reloading = true;

                    let done_fast_reload: boolean = false;

                    const options_final: i_options.Options =
                        s_reload.DefaultValues.tranform_reload_action({
                            reload_action: options,
                        });

                    if (n(options_final.after_reload_delay)) {
                        this.last_cooldown_time =
                            (options_final.after_reload_delay + this.full_reload_delay) * 3;

                        if (!this.allow_fast_reload) {
                            s_badge.Badge.show_timer_badge({
                                time: options_final.after_reload_delay + this.full_reload_delay,
                            });
                        }
                    }

                    if (this.allow_fast_reload) {
                        this.allow_fast_reload = false;
                        done_fast_reload = true;

                        await this.reload(options_final);
                    }

                    if (n(options_final.after_reload_delay)) {
                        globalThis.clearTimeout(this.reload_cooldown_timer);

                        this.reload_cooldown_timer_start_timestamp = Date.now();

                        this.reload_cooldown_timer = self.setTimeout(() => {
                            err(() => {
                                this.reload_cooldown_timer_start_timestamp = 0;
                                this.allow_fast_reload = true;
                            }, 'aer_1094');
                        }, this.last_cooldown_time);

                        this.debounce_reload_timer = self.setTimeout(() => {
                            err(() => {
                                if (!done_fast_reload) {
                                    this.reload(options_final);
                                }
                            }, 'aer_1095');
                        }, options_final.after_reload_delay + this.full_reload_delay);

                        this.reloading = false;
                    }
                }
            }
        }, 'aer_1035');

    private reload = (options: i_options.Options): Promise<void> =>
        err_async(async () => {
            const options_final: i_options.Options = s_reload.DefaultValues.tranform_reload_action({
                reload_action: options,
            });

            let at_least_one_extension_reloaded: boolean = false;

            if (options_final.hard) {
                const exts: Management.ExtensionInfo[] = await we.management.getAll();
                const ext_tabs: Tabs.Tab[] = await s_reload.Tabs.get_ext_tabs();
                const new_tab_tabs: Tabs.Tab[] = await s_reload.Tabs.get_new_tab_tabs();
                const re_enable_callers: t.CallbackVoid[] = [];
                s_reload.Tabs.ext_tabs = [];

                await Promise.all(
                    exts.map(async (ext_info: Management.ExtensionInfo) =>
                        err_async(async () => {
                            const ext_tabs_final: Tabs.Tab[] = ext_tabs.flatMap(
                                (ext_tab: t.AnyRecord): Tabs.Tab[] =>
                                    err(() => {
                                        const reg_exp_extension = new RegExp(
                                            s_reload.Tabs.ext_protocol + ext_info.id,
                                        );

                                        const matched_tab = reg_exp_extension.test(ext_tab.url);

                                        if (matched_tab) {
                                            ext_tab.ext_id = ext_info.id;

                                            return [ext_tab as Tabs.Tab];
                                        }

                                        return [];
                                    }, 'aer_1036'),
                            );

                            const extension_is_eligible_for_reload: boolean =
                                await s_reload_shared.Watch.extension_is_eligible_for_reload({
                                    ext_id: options_final.ext_id,
                                    ext_info,
                                    settings: data.settings,
                                });

                            if (extension_is_eligible_for_reload) {
                                s_reload.Tabs.ext_tabs.push(...ext_tabs_final);

                                if (n(options_final.after_reload_delay)) {
                                    re_enable_callers.push(async (): Promise<void> => {
                                        if (n(options_final.after_reload_delay)) {
                                            const reload_triggered = await this.trigger_reload({
                                                ext_info,
                                            });

                                            await this.re_enable({
                                                ext_info,
                                                ext_tabs: ext_tabs_final as Tabs.Tab[],
                                                after_reload_delay:
                                                    options_final.after_reload_delay,
                                                reload_triggered,
                                            });
                                        }
                                    });
                                }

                                at_least_one_extension_reloaded = true;
                            }
                        }, 'aer_1038'),
                    ),
                );

                await s_reload.Tabs.create_temporary_tabs();

                await Promise.all(
                    new_tab_tabs.map(async (tab: Tabs.Tab) =>
                        err_async(async () => {
                            if (n(tab.id)) {
                                await we.tabs.remove(tab.id);
                            }
                        }, 'aer_1090'),
                    ),
                );

                await Promise.all(
                    re_enable_callers.map(async (f: t.CallbackVoid) => {
                        await f();
                    }),
                );

                await s_reload.Tabs.recreate_tabs({ ext_tabs: new_tab_tabs });
                await s_reload.Tabs.remove_temporary_tabs();
            }

            if (at_least_one_extension_reloaded || !options_final.hard) {
                if (n(options_final.hard) && n(options_final.all_tabs)) {
                    await s_reload.Tabs.reload_tabs({
                        hard: options_final.hard,
                        all_tabs: options_final.all_tabs,
                    });
                }

                await s_badge.Badge.show_ok_badge();

                if (options_final.play_sound) {
                    ext.send_msg({
                        msg: 'play_reload_sound',
                        reload_notification_volume: data.settings.prefs.reload_notification_volume,
                    });
                }
            }
        }, 'aer_1039');

    private trigger_reload = ({
        ext_info,
    }: {
        ext_info: Management.ExtensionInfo;
    }): Promise<boolean> =>
        err_async(async () => {
            let reload_triggered = false;

            const reload_ext = (): Promise<void> =>
                err(async () => {
                    await we.runtime.sendMessage(ext_info.id, {
                        msg: new s_suffix.Suffix('reload_extension').result,
                    });

                    reload_triggered = true;
                }, 'aer_1088');

            await Promise.race([reload_ext(), x.delay(this.full_reload_delay)]); // if target extension service worker is broken (if background js is in incorrect state) the extension can not be reloaded with we.runtime.reload(); and the response of the "reload_extension" message will not be recieved. In this case if 1000 ms elapsed and no response from extension recieved forcefully reload extension with we.management.setEnabled(ext_info.id, false); we.management.setEnabled(ext_info.id, true);. Include 1000 ms delay in "try_to_reload" function.
            await we.management.setEnabled(ext_info.id, true);

            return reload_triggered;
        }, 'aer_1040');

    private re_enable = ({
        ext_info,
        ext_tabs,
        after_reload_delay,
        reload_triggered,
    }: {
        ext_info: Management.ExtensionInfo;
        ext_tabs: Tabs.Tab[];
        after_reload_delay: number;
        reload_triggered: boolean;
    }): Promise<void> =>
        err_async(async () => {
            if (!reload_triggered) {
                await we.management.setEnabled(ext_info.id, false);
                await we.management.setEnabled(ext_info.id, true);
            }

            await x.delay(after_reload_delay);

            await s_reload.Tabs.recreate_tabs({ ext_tabs });
        }, 'aer_1089');

    public suspend_or_resume_automatic_reload = (): Promise<void> =>
        err_async(async () => {
            this.running_suspend_or_resume_automatic_reload_f = true;

            data.settings.prefs.suspend_automatic_reload =
                !data.settings.prefs.suspend_automatic_reload;

            await s_data.Manipulation.update_settings({ settings: data.settings });

            s_badge.Badge.show_reload_suspended_badge();

            this.running_suspend_or_resume_automatic_reload_f = false;

            if (s_data.Manipulation.set_from_storage_run_prevented) {
                await s_data.Manipulation.set_from_storage({ transform: true });
            }
        }, 'aer_1101');
}

export const Watch = Class.get_instance();
