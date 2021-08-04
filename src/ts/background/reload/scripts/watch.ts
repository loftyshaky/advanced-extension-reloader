import { Management, Tabs } from 'webextension-polyfill-ts';

import { s_suffix, i_options } from 'shared/internal';
import { s_reload } from 'background/internal';

export class Watch {
    private static i0: Watch;

    public static i(): Watch {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private reloading: boolean = false;
    public ext_id: string = '';
    private hardfull: boolean = false;
    private reload_call_count: number = 0;

    public reload = (options: i_options.Options): Promise<void> =>
        err_async(async () => {
            this.reload_call_count += 1;

            const options_final: i_options.Options =
                s_reload.DefaultValues.i().tranform_reload_action({
                    reload_action: options,
                });

            this.hardfull = options_final.hardfull;

            if (!this.reloading || this.hardfull) {
                this.reloading = true;

                if (options_final.hard) {
                    if (n(options_final.ext_id)) {
                        const running_for_the_first_time = this.ext_id === '';

                        this.ext_id = options_final.ext_id;

                        if (running_for_the_first_time) {
                            await s_reload.Tabs.i().get_opened_ext_tabs_specefic_ext();
                        }
                    }

                    const apps_info: Management.ExtensionInfo[] = await we.management.getAll();
                    const apps_info_filtered: Management.ExtensionInfo[] = apps_info.filter(
                        (app_info: Management.ExtensionInfo): boolean =>
                            err(() => app_info.id !== we.runtime.id, 'aer_1058'),
                    );
                    const ext_id_exists = typeof options_final.ext_id === 'string';

                    const ids: string[] = [];

                    apps_info_filtered.forEach((app_info: Management.ExtensionInfo): void =>
                        err(() => {
                            const matched_app_id_from_options =
                                app_info.id === options_final.ext_id;

                            if (
                                app_info.id !== we.runtime.id &&
                                app_info.installType === 'development' &&
                                (app_info as any).type !== 'theme' &&
                                app_info.enabled &&
                                (!ext_id_exists || matched_app_id_from_options)
                            ) {
                                ids.push(app_info.id);
                            }
                        }, 'aer_1045'),
                    );

                    if (options_final.hardfull && ext_id_exists) {
                        await (we as any).runtime.sendMessage(options_final.ext_id, {
                            msg: new s_suffix.Main('reload_extension').result,
                        });
                    } else {
                        const urls: string[] = ids.map((id: string) =>
                            err(() => `chrome-extension://${id}`, 'aer_1046'),
                        );
                        const ext_tabs: Tabs.Tab[] =
                            await s_reload.Tabs.i().get_opened_ext_tabs_urls({
                                urls,
                            });

                        await Promise.all(
                            ids.map(
                                (id: string): Promise<void> =>
                                    err_async(async () => {
                                        await we.management.setEnabled(id, false);
                                        await we.management.setEnabled(id, true);
                                    }, 'aer_1028'),
                            ),
                        );

                        await this.after_enabled({ tabs: ext_tabs });
                    }
                }

                this.reloading = false;

                if (options_final.all_tabs) {
                    await s_reload.Tabs.i().reload_all_tabs();
                } else {
                    const { last_active_tab_id } = s_reload.Tabs.i();
                    const need_to_reload_tab = await s_reload.Tabs.i().check_if_need_to_reload_tab({
                        tab_id: last_active_tab_id,
                    });

                    if (need_to_reload_tab) {
                        await we.tabs.reload(last_active_tab_id);
                    }
                }

                ext.send_msg({ msg: 'show_badge' });
            }
        }, 'aer_1005');

    private after_enabled = ({ tabs }: { tabs: Tabs.Tab[] }): Promise<void> =>
        err_async(async () => {
            await Promise.all(
                tabs.map(
                    (tab): Promise<void> =>
                        err_async(async () => {
                            await s_reload.Tabs.i().recreate_tab({ tab });
                        }, 'aer_1031'),
                ),
            );
        }, 'aer_1052');

    public on_enabled = (info: Management.ExtensionInfo): void =>
        err(() => {
            this.reload_call_count -= 1;

            if (this.hardfull && info.id === this.ext_id && this.reload_call_count >= 0) {
                this.reload_call_count = 0;

                this.after_enabled({ tabs: s_reload.Tabs.i().opened_ext_tabs });
            } else if (this.reload_call_count < 0) {
                this.reload_call_count = 0;
            }
        }, 'aer_1054');
}
