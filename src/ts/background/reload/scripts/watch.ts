import {
    browser,
    Management,
    Tabs,
} from 'webextension-polyfill-ts';
import io from 'socket.io-client';

import { i_shared } from 'shared/internal';

import {
    s_badge,
    s_reload,
} from 'background/internal';

export class Watch {
    private static i0: Watch;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    private clients: any[] = [];
    private reloading: boolean = false;

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
        options: i_shared.Options,
    ): Promise<void> => err_async(
        async () => {
            if (!this.reloading) {
                this.reloading = true;

                const options_final: i_shared.Options = (
                    s_reload.DefaultValues.i.tranform_reload_action({ reload_action: options })
                );

                if (options_final.hard) {
                    const apps_info: Management.ExtensionInfo[] = await browser.management.getAll();
                    const app_id_exists = typeof options_final.ext_id === 'string';

                    const ids: string[] = [];

                    apps_info.forEach(
                        (app_info: Management.ExtensionInfo): void => err(
                            () => {
                                const matched_app_id_from_options = (
                                    app_info.id === options_final.ext_id
                                );

                                if (
                                    app_info.id !== browser.runtime.id
                                    && app_info.installType === 'development'
                                    && (apps_info as any).type !== 'theme'
                                    && app_info.enabled
                                    && (
                                        !app_id_exists
                                        || matched_app_id_from_options
                                    )
                                ) {
                                    ids.push(app_info.id);
                                }
                            },
                            1045,
                        ),
                    );

                    const urls: string[] = ids.map((id: string) => err(
                        () => `chrome-extension://${id}`,
                        1046,
                    ));

                    const ext_tabs: Tabs.Tab[] = await s_reload.Tabs.i.get_opened_ext_tabs(
                        { urls },
                    );

                    await Promise.all(ids.map(
                        (id: string): Promise<void> => err_async(
                            async () => {
                                await browser.management.setEnabled(
                                    id,
                                    false,
                                );
                                await browser.management.setEnabled(
                                    id,
                                    true,
                                );
                            },
                            1028,
                        ),
                    ));

                    await Promise.all(ext_tabs.map(
                        (tab: Tabs.Tab): Promise<void> => err_async(
                            async () => {
                                await s_reload.Tabs.i.recreate_tab({ tab });
                            },
                            1031,
                        ),
                    ));
                }

                if (options_final.all_tabs) {
                    await s_reload.Tabs.i.reload_all_tabs();
                } else {
                    const { last_active_tab_id } = s_reload.Tabs.i;
                    await browser.tabs.reload(last_active_tab_id);
                }

                s_badge.Badge.i.show();

                this.reloading = false;
            }
        },
        1005,
    );
}

browser.browserAction.onClicked.addListener((): Promise<void> => err_async(async () => {
    const click_action = await ext.storage_get('click_action');

    Watch.i.reload(click_action.click_action);
},
1008));
