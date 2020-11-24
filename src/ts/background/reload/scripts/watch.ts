import { browser, Management, Tabs, Windows } from 'webextension-polyfill-ts';
import io from 'socket.io-client';

import { s_reload } from 'background/internal';

export class Watch {
    private static i0: Watch;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    public client = io.connect('http://localhost:7220');

    public reload = (
        {
            hard = false,
            all_tabs = false,
        }: {
            hard?: boolean;
            all_tabs?: boolean;
        },
    ): Promise<void> => err_async(
        async () => {
            const apps_info: Management.ExtensionInfo[] = await browser.management.getAll();
            const { last_active_tab } = s_reload;

            await Promise.all(apps_info.map(
                (app_info: Management.ExtensionInfo): Promise<void> => err_async(
                    async () => {
                        if (
                            app_info.name !== 'Extension Reloader'
                    && app_info.installType === 'development'
                    && n(app_info.enabled)
                        ) {
                            if (hard) {
                                await browser.management.setEnabled(
                                    app_info.id,
                                    false,
                                );
                                await browser.management.setEnabled(
                                    app_info.id,
                                    true,
                                );
                            }
                        }
                    },
                    1006,
                ),
            ));

            if (all_tabs) {
                this.all_tabs();
            } else {
                browser.tabs.reload(last_active_tab);
            }
        },
        1005,
    );

    private all_tabs = (): Promise<void> => err_async(async () => {
        const wins: Windows.Window[] = await browser.windows.getAll({ populate: true });

        wins.forEach((win: Windows.Window): void => {
            if (n(win.tabs)) {
                win.tabs.forEach((tab: Tabs.Tab): void => {
                    browser.tabs.reload(tab.id);
                });
            }
        });
    },
    1007);
}

browser.browserAction.onClicked.addListener((): Promise<void> => err_async(async () => {
    const click_action = await ext.storage_get('click_action');

    Watch.i.reload(click_action.click_action);
},
1008));

Watch.i.client.on(
    'reload_app',
    Watch.i.reload,
);
