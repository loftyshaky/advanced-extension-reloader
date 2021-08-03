import { browser, Management, Tabs } from 'webextension-polyfill-ts';

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

    public reload = (options: i_options.Options): Promise<void> =>
        err_async(async () => {
            if (!this.reloading) {
                this.reloading = true;

                const options_final: i_options.Options =
                    s_reload.DefaultValues.i().tranform_reload_action({ reload_action: options });

                if (options_final.hard) {
                    const apps_info: Management.ExtensionInfo[] = await browser.management.getAll();
                    const ext_id_exists = typeof options_final.ext_id === 'string';

                    const ids: string[] = [];

                    apps_info.forEach((app_info: Management.ExtensionInfo): void =>
                        err(() => {
                            const matched_app_id_from_options =
                                app_info.id === options_final.ext_id;

                            if (
                                app_info.id !== browser.runtime.id &&
                                app_info.installType === 'development' &&
                                (apps_info as any).type !== 'theme' &&
                                app_info.enabled &&
                                (!ext_id_exists || matched_app_id_from_options)
                            ) {
                                ids.push(app_info.id);
                            }
                        }, 'aer_1045'),
                    );

                    const urls: string[] = ids.map((id: string) =>
                        err(() => `chrome-extension://${id}`, 'aer_1046'),
                    );

                    const ext_tabs: Tabs.Tab[] = await s_reload.Tabs.i().get_opened_ext_tabs({
                        urls,
                    });

                    const after_enabled = (): Promise<void> =>
                        err_async(async () => {
                            await Promise.all(
                                ext_tabs.map(
                                    (tab: Tabs.Tab): Promise<void> =>
                                        err_async(async () => {
                                            await s_reload.Tabs.i().recreate_tab({ tab });
                                        }, 'aer_1031'),
                                ),
                            );
                        }, 'aer_1052');

                    const on_enabled = (info: Management.ExtensionInfo): void =>
                        err(() => {
                            browser.management.onEnabled.removeListener(on_enabled);

                            if (info.id === options_final.ext_id) {
                                after_enabled();
                            }
                        }, 'aer_1054');

                    if (options_final.hardfull && ext_id_exists) {
                        browser.management.onEnabled.addListener(on_enabled);

                        await (we as any).runtime.sendMessage(options_final.ext_id, {
                            msg: new s_suffix.Main('reload_extension').result,
                        });
                    } else {
                        await Promise.all(
                            ids.map(
                                (id: string): Promise<void> =>
                                    err_async(async () => {
                                        await browser.management.setEnabled(id, false);
                                        await browser.management.setEnabled(id, true);
                                    }, 'aer_1028'),
                            ),
                        );

                        await after_enabled();
                    }
                }

                if (options_final.all_tabs) {
                    await s_reload.Tabs.i().reload_all_tabs();
                } else {
                    const { last_active_tab_id } = s_reload.Tabs.i();

                    browser.tabs.reload(last_active_tab_id);
                }

                ext.send_msg({ msg: 'show_badge' });

                this.reloading = false;
            }
        }, 'aer_1005');
}
