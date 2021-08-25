import _ from 'lodash';
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

    private old_debounce_delay: number | undefined;
    public generate_reload_debounce_and_run_reload_f = ({
        options,
    }: {
        options: i_options.Options;
    }): Promise<void> =>
        err_async(async () => {
            const options_final: i_options.Options =
                s_reload.DefaultValues.i().tranform_reload_action({
                    reload_action: options,
                });

            if (n(options_final.after_enable_delay) && n(options_final.full_reload_timeout)) {
                if (options_final.hard) {
                    const new_debounce_delay =
                        options_final.after_enable_delay + options_final.full_reload_timeout;
                    if (
                        !n(this.old_debounce_delay) ||
                        (n(this.old_debounce_delay) &&
                            new_debounce_delay !== this.old_debounce_delay)
                    ) {
                        this.reload_debounce = _.debounce(this.reload, new_debounce_delay);
                    }

                    this.old_debounce_delay = new_debounce_delay;
                } else {
                    this.reload_debounce = this.reload;

                    this.old_debounce_delay = undefined;
                }

                this.reload_debounce(options_final);
            }
        }, 'aer_1035');

    public reload_debounce: t.CallbackVariadicVoid = () => undefined;

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

                await Promise.all(
                    exts.map(async (ext_info: Management.ExtensionInfo) =>
                        err_async(async () => {
                            const ext_tabs_final: (Tabs.Tab | undefined)[] = ext_tabs
                                .map((ext_tab: t.AnyRecord): Tabs.Tab | undefined =>
                                    err(() => {
                                        const reg_exp = new RegExp(
                                            s_reload.Tabs.i().ext_protocol + ext_info.id,
                                        );
                                        const matched_tab = reg_exp.test(ext_tab.url);

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
                                if (
                                    n(options_final.full_reload_timeout) &&
                                    n(options_final.after_enable_delay)
                                ) {
                                    await this.re_enable({
                                        ext_info,
                                        ext_tabs: ext_tabs_final as Tabs.Tab[],
                                        after_enable_delay: options_final.after_enable_delay,
                                        full_reload_timeout: options_final.full_reload_timeout,
                                    });
                                }
                            }
                        }, 'aer_1038'),
                    ),
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
                ext.send_msg({ msg: 'play_sound' });
            }
        }, 'aer_1039');

    private re_enable = ({
        ext_info,
        ext_tabs,
        after_enable_delay,
        full_reload_timeout,
    }: {
        ext_info: Management.ExtensionInfo;
        ext_tabs: Tabs.Tab[];
        after_enable_delay: number;
        full_reload_timeout: number;
    }): Promise<void> =>
        err_async(async () => {
            let reload_triggered = false;

            ((env.browser === 'firefox' ? browser : chrome) as any).runtime.sendMessage(
                ext_info.id,
                {
                    msg: new s_suffix.Main('reload_extension').result,
                },
                (response: any) => {
                    if (we.runtime.lastError) {
                        // eslint-disable-next-line no-console
                        console.error(we.runtime.lastError.message);
                    }

                    if (response === new s_suffix.Main('reload_triggered').result) {
                        reload_triggered = true;
                    }
                },
            );

            await x.delay(full_reload_timeout);

            if (!reload_triggered) {
                await we.management.setEnabled(ext_info.id, false);
                await we.management.setEnabled(ext_info.id, true);

                await x.delay(after_enable_delay);
            }

            await s_reload.Tabs.i().recreate_tabs({ ext_tabs });
        }, 'aer_1040');
}
