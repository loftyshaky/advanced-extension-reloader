import { Tabs, Management } from 'webextension-polyfill';

import { t } from '@loftyshaky/shared';
import { s_suffix, i_options } from 'shared/internal';
import { s_badge, s_data, s_reload } from 'background/internal';

export class Watch {
    private static i0: Watch;

    public static i(): Watch {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
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
            const settings = await ext.storage_get();

            if (!automatic_reload || (automatic_reload && !settings.suspend_automatic_reload)) {
                globalThis.clearTimeout(this.reload_cooldown_timer);
                globalThis.clearTimeout(this.debounce_reload_timer);

                if (!this.reloading) {
                    this.reloading = true;

                    let done_fast_reload: boolean = false;

                    const options_final: i_options.Options =
                        s_reload.DefaultValues.i().tranform_reload_action({
                            reload_action: options,
                        });

                    if (n(options_final.after_reload_delay)) {
                        this.last_cooldown_time =
                            (options_final.after_reload_delay + this.full_reload_delay) * 3;

                        if (!this.allow_fast_reload) {
                            s_badge.Main.i().show_timer_badge({
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
            const settings = await ext.storage_get();

            const options_final: i_options.Options =
                s_reload.DefaultValues.i().tranform_reload_action({
                    reload_action: options,
                });

            if (options_final.hard) {
                const ext_id_option_specified = typeof options_final.ext_id === 'string';
                const exts: Management.ExtensionInfo[] = await we.management.getAll();
                const ext_tabs: Tabs.Tab[] = await s_reload.Tabs.i().get_ext_tabs();
                const new_tab_tabs: Tabs.Tab[] = await s_reload.Tabs.i().get_new_tab_tabs();
                const re_enable_callers: t.CallbackVoid[] = [];

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
                    exts.map(async (ext_info: Management.ExtensionInfo) =>
                        err_async(async () => {
                            const ext_tabs_final: (Tabs.Tab | undefined)[] = ext_tabs
                                .map((ext_tab: t.AnyRecord): Tabs.Tab | undefined =>
                                    err(() => {
                                        const reg_exp_extension = new RegExp(
                                            s_reload.Tabs.i().ext_protocol + ext_info.id,
                                        );

                                        const matched_tab = reg_exp_extension.test(ext_tab.url);

                                        if (matched_tab) {
                                            ext_tab.ext_id = ext_info.id;

                                            return ext_tab as Tabs.Tab;
                                        }

                                        return undefined;
                                    }, 'aer_1036'),
                                )
                                .filter((ext_tab: Tabs.Tab | undefined): boolean =>
                                    err(() => n(ext_tab), 'aer_1037'),
                                );

                            const matched_ext_id_from_options =
                                ext_info.id === options_final.ext_id;

                            if (
                                ext_info.id !== we.runtime.id &&
                                ext_info.enabled &&
                                ext_info.installType === 'development' &&
                                ((ext_info.type === 'theme' && settings.allow_theme_reload) ||
                                    ext_info.type !== 'theme') &&
                                (!ext_id_option_specified || matched_ext_id_from_options)
                            ) {
                                if (n(options_final.after_reload_delay)) {
                                    const reload_triggered = await this.trigger_reload({
                                        ext_info,
                                    });

                                    re_enable_callers.push(async (): Promise<void> => {
                                        if (n(options_final.after_reload_delay)) {
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
                            }
                        }, 'aer_1038'),
                    ),
                );

                await Promise.all(
                    re_enable_callers.map(async (f: t.CallbackVoid) => {
                        await f();
                    }),
                );

                await s_reload.Tabs.i().recreate_tabs({ ext_tabs: new_tab_tabs });
            }

            if (n(options_final.hard) && n(options_final.all_tabs)) {
                await s_reload.Tabs.i().reload_tabs({
                    hard: options_final.hard,
                    all_tabs: options_final.all_tabs,
                });
            }

            await s_badge.Main.i().show_ok_badge();

            if (options_final.play_sound) {
                ext.send_msg({
                    msg: 'play_reload_sound',
                    reload_notification_volume: settings.reload_notification_volume,
                });
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
                        msg: new s_suffix.Main('reload_extension').result,
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

            await s_reload.Tabs.i().recreate_tabs({ ext_tabs });
        }, 'aer_1089');

    public suspend_or_resume_automatic_reload = (): Promise<void> =>
        err_async(async () => {
            this.running_suspend_or_resume_automatic_reload_f = true;

            const settings = await ext.storage_get();
            settings.suspend_automatic_reload = !settings.suspend_automatic_reload;

            await s_data.Main.i().update_settings({ settings });

            s_badge.Main.i().show_reload_suspended_badge();

            this.running_suspend_or_resume_automatic_reload_f = false;

            if (s_data.Main.i().set_from_storage_run_prevented) {
                await s_data.Main.i().set_from_storage({ transform: true });
            }
        }, 'aer_1101');
}
