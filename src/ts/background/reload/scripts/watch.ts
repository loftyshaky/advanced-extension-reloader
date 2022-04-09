import { Tabs, Management } from 'webextension-polyfill-ts';

import { t } from '@loftyshaky/shared';
import { s_suffix, i_options } from 'shared/internal';
import { s_badge, s_reload } from 'background/internal';

export class Watch {
    private static i0: Watch;

    public static i(): Watch {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private cancel_reload: boolean = false;
    private reload_canceled: boolean = false;
    private cancel_reload_timer: number = 0;
    private full_reload_delay: number = 1000;

    public try_to_reload = ({ options }: { options: i_options.Options }): Promise<void> =>
        err_async(async () => {
            const options_final: i_options.Options =
                s_reload.DefaultValues.i().tranform_reload_action({
                    reload_action: options,
                });

            if (this.cancel_reload) {
                this.reload_canceled = true;
            } else {
                this.reload(options_final);
            }

            if (n(options_final.after_reload_delay)) {
                this.cancel_reload = true;

                self.clearTimeout(this.cancel_reload_timer);

                this.cancel_reload_timer = self.setTimeout(() => {
                    err(() => {
                        this.cancel_reload = false;

                        if (this.reload_canceled) {
                            this.reload_canceled = false;
                            this.reload(options_final);
                        }
                    }, 'cnt_53566');
                }, options_final.after_reload_delay + this.full_reload_delay + 500);
            }
        }, 'aer_1035');

    public reload = (options: i_options.Options): Promise<void> =>
        err_async(async () => {
            const options_final: i_options.Options =
                s_reload.DefaultValues.i().tranform_reload_action({
                    reload_action: options,
                });

            if (options_final.hard) {
                const ext_id_option_specified = typeof options_final.ext_id === 'string';
                const exts: Management.ExtensionInfo[] = await we.management.getAll();
                const ext_tabs: Tabs.Tab[] = await s_reload.Tabs.i().get_ext_tabs();
                const re_enable_callers: t.CallbackVoid[] = [];

                await Promise.all(
                    exts.map(async (ext_info: Management.ExtensionInfo) =>
                        err_async(async () => {
                            const ext_tabs_final: (Tabs.Tab | undefined)[] = ext_tabs
                                .map((ext_tab: t.AnyRecord): Tabs.Tab | undefined =>
                                    err(() => {
                                        const reg_exp_browser = new RegExp(
                                            `${s_reload.Tabs.i().browser_protocol}newtab`,
                                        );
                                        const reg_exp_extension = new RegExp(
                                            s_reload.Tabs.i().ext_protocol + ext_info.id,
                                        );
                                        const browser_protocol_tab: boolean = reg_exp_browser.test(
                                            ext_tab.url,
                                        ); // for example new tab

                                        const tab_belongs_to_this_extension: boolean =
                                            n(ext_tab.favIconUrl) &&
                                            ext_tab.favIconUrl.includes(ext_info.id);
                                        const matched_new_tab_page_tab: boolean =
                                            browser_protocol_tab && tab_belongs_to_this_extension;

                                        if (
                                            matched_new_tab_page_tab &&
                                            ((n(options_final.ext_id) &&
                                                ext_info.id === options_final.ext_id) ||
                                                !n(options_final.ext_id))
                                        ) {
                                            we.tabs.remove(ext_tab.id);
                                        }

                                        const matched_tab =
                                            matched_new_tab_page_tab ||
                                            reg_exp_extension.test(ext_tab.url);

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
            }

            if (n(options_final.hard) && n(options_final.all_tabs)) {
                await s_reload.Tabs.i().reload_tabs({
                    hard: options_final.hard,
                    all_tabs: options_final.all_tabs,
                });
            }

            await s_badge.Main.i().show();

            if (options_final.play_sound) {
                ext.send_msg({ msg: 'play_reload_sound' });
            }
        }, 'aer_1039');

    private trigger_reload = ({
        ext_info,
    }: {
        ext_info: Management.ExtensionInfo;
    }): Promise<boolean> =>
        err_async(async () => {
            let reload_triggered = false;

            try {
                const reload_ext = (): Promise<void> =>
                    err(async () => {
                        await we.runtime.sendMessage(ext_info.id, {
                            msg: new s_suffix.Main('reload_extension').result,
                        });

                        reload_triggered = true;
                    }, 'aer_1088');

                await Promise.race([reload_ext(), x.delay(this.full_reload_delay)]); // if target extension service worker is broken (if background js is in incorrect state) the extension can not be reloaded with chrome.runtime.reload(); and the response of the "reload_extension" message will not be recieved. In this case if 1000 ms elapsed and no response from extension recieved forcefully reload extension with chrome.management.setEnabled(ext_info.id, false); chrome.management.setEnabled(ext_info.id, true);. Include 1000 ms delay in "try_to_reload" function.
                await we.management.setEnabled(ext_info.id, true);
            } catch (error_obj: any) {
                show_err_ribbon(error_obj, 'aer_1084', { silent: true });
            }

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
}
