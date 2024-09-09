import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import { Tabs, Management } from 'webextension-polyfill';

import { t } from '@loftyshaky/shared/shared_clean';
import { s_reload as s_reload_shared, s_suffix, i_options } from 'shared_clean/internal';
import { s_badge, s_data, s_reload, i_reload } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public reloading: boolean = false;
    public after_reload_delay_timer_canceled: boolean = false;
    public cancel_reload_f_execution: boolean = false;
    public running_pause_or_resume_automatic_reload_f: boolean = false;
    private attempted_to_reload_during_before_ext_reload_execution_phase: boolean = false;
    public attempted_to_reload_during_before_tab_recreate_execution_phase: boolean = false;
    private attempted_to_reload_during_after_tab_recreate_execution_phase: boolean = false;
    private reload_f_execution_phase: i_reload.ReloadFExecutionPhase = 'none';
    private automatic_reload: boolean = false;
    private reload_throttle_fs = new Map<number, (options: i_options.Options) => Promise<void>>();

    public try_to_reload = async ({
        options,
        automatic_reload = false,
    }: {
        options: i_options.Options;
        automatic_reload?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            const options_final: i_options.Options = s_reload.DefaultValues.tranform_reload_action({
                reload_action: options,
            });
            const is_hard: boolean = n(options_final.hard) && options_final.hard;

            if (is_hard) {
                if (n(this.after_reload_delay_cancel_delay)) {
                    this.after_reload_delay_cancel_delay();
                }

                this.automatic_reload = automatic_reload;

                if (this.reload_f_execution_phase === 'before_ext_reload') {
                    this.attempted_to_reload_during_before_ext_reload_execution_phase = true;
                }

                if (this.reload_f_execution_phase === 'before_tab_recreate') {
                    this.attempted_to_reload_during_before_tab_recreate_execution_phase = true;
                }

                if (this.reload_f_execution_phase === 'after_tab_recreate') {
                    this.attempted_to_reload_during_after_tab_recreate_execution_phase = true;
                }
            }

            if (
                (!this.automatic_reload ||
                    (automatic_reload && !data.settings.prefs.pause_automatic_reload)) &&
                is_hard &&
                this.reload_f_execution_phase === 'none' &&
                !this.attempted_to_reload_during_before_ext_reload_execution_phase &&
                !this.attempted_to_reload_during_before_tab_recreate_execution_phase &&
                !this.attempted_to_reload_during_after_tab_recreate_execution_phase
            ) {
                this.reload_throttle({ options: options_final });
            } else if (!is_hard) {
                this.reload(options_final);
            }
        }, 'aer_1035');

    private reload = (options: i_options.Options): Promise<void> =>
        err_async(async () => {
            const extension_is_eligible_for_reload_f = ({
                ext_info,
            }: {
                ext_info: Management.ExtensionInfo;
            }): Promise<boolean> =>
                err_async(
                    async () =>
                        n(options_final)
                            ? s_reload_shared.Watch.extension_is_eligible_for_reload({
                                  ext_id: options_final.ext_id,
                                  ext_info,
                                  settings: data.settings,
                              })
                            : false,
                    'aer_1142',
                );

            const generate_reload_f =
                ({ ext_info }: { ext_info: Management.ExtensionInfo }): (() => Promise<void>) =>
                async () => {
                    err_async(async () => {
                        if (
                            n(options_final) &&
                            n(options_final.after_reload_delay) &&
                            n(options_final.listen_message_response_timeout)
                        ) {
                            const reload_triggered = await this.trigger_reload({
                                ext_info,
                                listen_message_response_timeout:
                                    options_final.listen_message_response_timeout,
                            });

                            await this.re_enable({
                                ext_info,
                                reload_triggered,
                            });
                        }
                    }, 'aer_1143');
                };

            const options_final: i_options.Options = s_reload.DefaultValues.tranform_reload_action({
                reload_action: options,
            });

            if (options_final.hard) {
                this.reload_f_execution_phase = 'before_ext_reload';
                this.after_reload_delay_timer_canceled = false;
                this.cancel_reload_f_execution = false;
            }

            let at_least_one_extension_reloaded: boolean = false;
            let at_least_one_extension_tab_is_open: boolean = false;
            let tabs_to_reload: Tabs.Tab[] = [];

            if (options_final.hard) {
                if (this.attempted_to_reload_during_before_ext_reload_execution_phase) {
                    this.cancel_reload_f_execution = true;

                    this.reset_reload_f_execution_phase_flags();
                } else {
                    at_least_one_extension_reloaded = false;

                    const exts: Management.ExtensionInfo[] = await we.management.getAll();
                    s_reload.Tabs.ext_tabs_recreate = s_reload.Tabs.pending_tabs_recreate
                        ? s_reload.Tabs.ext_tabs_recreate
                        : await s_reload.Tabs.get_ext_tabs();
                    const new_ext_tabs: Tabs.Tab[] = [];
                    const new_tab_tabs: Tabs.Tab[] = await s_reload.Tabs.get_new_tab_tabs();
                    const re_enable_callers: t.CallbackVoid[] = [];
                    s_reload.Tabs.new_tab_tabs = s_reload.Tabs.pending_tabs_recreate
                        ? s_reload.Tabs.new_tab_tabs
                        : new_tab_tabs;
                    s_reload.Tabs.pending_tabs_recreate = true;

                    await Promise.all(
                        exts.map(async (ext_info: Management.ExtensionInfo) =>
                            err_async(async () => {
                                if (n(options_final)) {
                                    const ext_tabs_final: Tabs.Tab[] =
                                        s_reload.Tabs.ext_tabs_recreate.flatMap(
                                            (ext_tab: t.AnyRecord): Tabs.Tab[] =>
                                                err(() => {
                                                    const reg_exp_extension = new RegExp(
                                                        s_reload.Tabs.ext_protocol + ext_info.id,
                                                    );

                                                    const matched_tab = reg_exp_extension.test(
                                                        ext_tab.url,
                                                    );

                                                    if (matched_tab) {
                                                        ext_tab.ext_id = ext_info.id;

                                                        return [ext_tab as Tabs.Tab];
                                                    }

                                                    return [];
                                                }, 'aer_1036'),
                                        );

                                    const extension_is_eligible_for_reload: boolean =
                                        await extension_is_eligible_for_reload_f({ ext_info });

                                    if (extension_is_eligible_for_reload) {
                                        new_ext_tabs.push(...ext_tabs_final);

                                        const reload_f = await generate_reload_f({ ext_info });

                                        re_enable_callers.push(reload_f);

                                        at_least_one_extension_reloaded = true;
                                    }
                                }
                            }, 'aer_1038'),
                        ),
                    );

                    s_reload.Tabs.ext_tabs = uniqWith(
                        [...s_reload.Tabs.ext_tabs, ...new_ext_tabs],
                        isEqual,
                    );

                    tabs_to_reload = [...s_reload.Tabs.ext_tabs, ...s_reload.Tabs.new_tab_tabs];

                    at_least_one_extension_tab_is_open = tabs_to_reload.length !== 0;

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

                    this.reload_f_execution_phase = 'before_tab_recreate';

                    const recreate_tabs = (): Promise<void> =>
                        err_async(async () => {
                            if (n(options_final)) {
                                if (
                                    at_least_one_extension_reloaded &&
                                    n(options_final.after_reload_delay)
                                ) {
                                    s_badge.Badge.show_prefixed_timer({
                                        prefix_name: 'reloading_tabs',
                                        time: options_final.after_reload_delay,
                                    });

                                    await this.after_reload_delay_delay_with_cancel(
                                        options_final.after_reload_delay,
                                    );
                                }

                                if (this.after_reload_delay_timer_canceled) {
                                    this.cancel_reload_f_execution = true;

                                    this.reset_reload_f_execution_phase_flags();
                                } else {
                                    if (at_least_one_extension_tab_is_open) {
                                        await s_reload.Tabs.recreate_tabs({
                                            ext_tabs: tabs_to_reload,
                                        });
                                    }

                                    await s_reload.Tabs.remove_temporary_tabs();
                                }
                            }
                        }, 'aer_1144');

                    if (
                        this.cancel_reload_f_execution ||
                        this.attempted_to_reload_during_before_tab_recreate_execution_phase ||
                        this.attempted_to_reload_during_before_ext_reload_execution_phase
                    ) {
                        this.cancel_reload_f_execution = true;

                        this.reset_reload_f_execution_phase_flags();
                    } else if (n(options_final.after_reload_delay)) {
                        await recreate_tabs();
                    }
                }
            }
            if (options_final.hard) {
                this.reload_f_execution_phase = 'after_tab_recreate';
            }

            if (
                options_final.hard &&
                (this.cancel_reload_f_execution ||
                    this.attempted_to_reload_during_before_tab_recreate_execution_phase ||
                    this.attempted_to_reload_during_before_ext_reload_execution_phase)
            ) {
                this.reset_reload_f_execution_phase_flags();
                await this.reload_throttle({ options: options_final });
            } else {
                const at_least_one_extension_reloaded_or_soft: boolean =
                    at_least_one_extension_reloaded || !options_final.hard;

                if (at_least_one_extension_reloaded_or_soft) {
                    if (n(options_final.hard) && n(options_final.all_tabs)) {
                        await s_reload.Tabs.reload_tabs({
                            hard: options_final.hard,
                            all_tabs: options_final.all_tabs,
                        });
                    }

                    if (options_final.hard) {
                        if (n(options_final.between_reloads_delay)) {
                            s_badge.Badge.show_prefixed_timer({
                                prefix_name: 'ok',
                                time: options_final.between_reloads_delay,
                            });
                        }
                    }
                }

                if (options_final.play_notifications) {
                    ext.send_msg({
                        msg: 'play_reload_notification',
                        reload_notification_volume: data.settings.prefs.reload_notification_volume,
                        ext_id: options_final.ext_id,
                        at_least_one_extension_reloaded:
                            !options_final.hard && !n(options_final.ext_id)
                                ? true
                                : at_least_one_extension_reloaded,
                    });
                }

                if (options_final.hard) {
                    if (at_least_one_extension_reloaded_or_soft) {
                        await x.delay(options_final.between_reloads_delay);
                    }

                    if (this.attempted_to_reload_during_after_tab_recreate_execution_phase) {
                        this.reset_reload_f_execution_phase_flags();
                        await this.reload_throttle({ options: options_final });
                    }

                    this.reload_f_execution_phase = 'none';
                }
            }
        }, 'aer_1039');

    private get_reload_throttle = ({ options }: { options: i_options.Options }) =>
        err(() => {
            const options_final: i_options.Options = s_reload.DefaultValues.tranform_reload_action({
                reload_action: options,
            });
            if (n(options_final) && n(options_final.reload_throttle_delay)) {
                if (!this.reload_throttle_fs.has(options_final.reload_throttle_delay)) {
                    const reload_throttle_fs = x.async_throttle(
                        this.reload,
                        options_final.reload_throttle_delay,
                    );

                    this.reload_throttle_fs.set(
                        options_final.reload_throttle_delay,
                        reload_throttle_fs,
                    );
                }

                return this.reload_throttle_fs.get(options_final.reload_throttle_delay)!;
            }

            return undefined;
        }, 'aer_1138');

    private reload_throttle = ({ options }: { options: i_options.Options }) =>
        err_async(async () => {
            const options_final: i_options.Options = s_reload.DefaultValues.tranform_reload_action({
                reload_action: options,
            });

            const throttled_reload = this.get_reload_throttle({ options });
            if (n(throttled_reload)) {
                await throttled_reload(options_final);
            }
        }, 'aer_1139');

    private trigger_reload = ({
        ext_info,
        listen_message_response_timeout,
    }: {
        ext_info: Management.ExtensionInfo;
        listen_message_response_timeout: number;
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

            await Promise.race([reload_ext(), x.delay(listen_message_response_timeout)]); // if target extension service worker is broken (if background js is in incorrect state) the extension can not be reloaded with we.runtime.reload(); and the response of the "reload_extension" message will not be recieved. In this case if 1000 ms elapsed and no response from extension recieved forcefully reload extension with we.management.setEnabled(ext_info.id, false); we.management.setEnabled(ext_info.id, true);.

            await this.ensure_ext_enabled({ ext_info }); // ensure extension enabled after reload before continue

            return reload_triggered;
        }, 'aer_1040');

    private re_enable = ({
        ext_info,
        reload_triggered,
    }: {
        ext_info: Management.ExtensionInfo;
        reload_triggered: boolean;
    }): Promise<void> =>
        err_async(async () => {
            if (!reload_triggered) {
                await we.management.setEnabled(ext_info.id, false);
                await we.management.setEnabled(ext_info.id, true);

                await this.ensure_ext_enabled({ ext_info }); // ensure extension enabled after reload before continue
            }
        }, 'aer_1089');

    private ensure_ext_enabled = async ({
        ext_info,
        attempt = 0,
    }: {
        ext_info: Management.ExtensionInfo;
        attempt?: number;
    }): Promise<void> =>
        err_async(async () => {
            const max_attempts = 100;
            // If the attempt exceeds max_attempts, stop and log an error
            if (attempt >= max_attempts) {
                throw_err('ensure_ext_enabled too many attempts.');
            }

            await x.delay(100);

            const ext_info_2: Management.ExtensionInfo = await we.management.get(ext_info.id);

            if (!ext_info_2.enabled) {
                // Increment attempt count and call the function recursively
                await this.ensure_ext_enabled({ ext_info, attempt: attempt + 1 });
            }
        }, 'aer_1135');

    private reset_reload_f_execution_phase_flags = (): void =>
        err(() => {
            this.reload_f_execution_phase = 'none';
            this.attempted_to_reload_during_before_ext_reload_execution_phase = false;
            this.attempted_to_reload_during_before_tab_recreate_execution_phase = false;
            this.attempted_to_reload_during_after_tab_recreate_execution_phase = false;
        }, 'aer_1137');

    public pause_or_resume_automatic_reload = (): Promise<void> =>
        err_async(async () => {
            this.running_pause_or_resume_automatic_reload_f = true;

            data.settings.prefs.pause_automatic_reload =
                !data.settings.prefs.pause_automatic_reload;

            await s_data.Manipulation.update_settings({ settings: data.settings });

            s_badge.Badge.show_reload_paused();

            this.running_pause_or_resume_automatic_reload_f = false;

            if (s_data.Manipulation.set_from_storage_run_prevented) {
                await s_data.Manipulation.set_from_storage({ transform: true });
            }
        }, 'aer_1101');

    private after_reload_delay_cancel_delay: (() => void) | null = null;

    private after_reload_delay_delay_with_cancel(delay: number): Promise<void> {
        return new Promise((resolve) => {
            err(() => {
                const timeout_id = setTimeout(resolve, delay);

                this.after_reload_delay_cancel_delay = () => {
                    this.after_reload_delay_timer_canceled = true;

                    clearTimeout(timeout_id);
                    resolve(); // Resolve the promise immediately on cancellation
                };
            }, 'aer_1136');
        });
    }
}

export const Watch = Class.get_instance();
