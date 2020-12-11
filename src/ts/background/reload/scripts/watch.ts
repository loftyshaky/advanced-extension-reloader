import {
    browser,
    Management,
    Windows,
    Tabs,
} from 'webextension-polyfill-ts';
import io from 'socket.io-client';

import { s_reload } from 'background/internal';

export class Watch {
    private static i0: Watch;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    private clients: any[] = [];
    public reloading: boolean = false;

    public connect = (): Promise<void> => err_async(async () => {
        const settings = await ext.storage_get('ports');

        this.clients.forEach((client: any): void => {
            client.close();
        });

        this.clients = [];

        settings.ports.forEach((port: number): void => {
            const client = io(`http://localhost:${port}`);
            this.clients.push(client);

            client.on(
                'reload_app',
                Watch.i.reload,
            );
        });
    },
    1026);

    public reload = (
        {
            all_tabs = false,
            hard = false,
        }: {
            all_tabs?: boolean;
            hard?: boolean;
        },
    ): Promise<void> => err_async(
        async () => {
            this.reloading = true;

            const apps_info: Management.ExtensionInfo[] = await browser.management.getAll();
            const { last_active_tab_id } = s_reload.Tabs.i;

            await Promise.all(apps_info.map(
                (app_info: Management.ExtensionInfo): Promise<void> => err_async(
                    async () => {
                        if (
                            app_info.id !== browser.runtime.id
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

            if (hard) {
                const current_window: Windows.Window = await browser.windows.getCurrent();

                await Promise.all(s_reload.Tabs.i.opened_tabs.map(
                    (tab: Tabs.Tab): Promise<void> => err_async(
                        async () => {
                            await s_reload.Tabs.i.recreate_tab({ tab });
                        },
                        1031,
                    ),
                ));

                if (n(current_window.id)) {
                    await browser.windows.update(
                        current_window.id,
                        { focused: true },
                    );
                }
            }

            if (all_tabs) {
                await s_reload.Tabs.i.reload_all_tabs();
            } else {
                await browser.tabs.reload(last_active_tab_id);
            }

            this.reloading = false;

            s_reload.Tabs.i.get_opened_ext_tabs();
        },
        1005,
    );
}

browser.browserAction.onClicked.addListener((): Promise<void> => err_async(async () => {
    const click_action = await ext.storage_get('click_action');

    Watch.i.reload(click_action.click_action);
},
1008));
