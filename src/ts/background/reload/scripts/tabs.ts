import { Tabs as TabsExt, Management } from 'webextension-polyfill-ts';

import { i_data } from 'shared/internal';
import { i_reload } from 'background/internal';

export class Tabs {
    private static i0: Tabs;

    public static i(): Tabs {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public background_path_url: string = we.runtime.getURL('background_tab.html');
    public background_tab: TabsExt.Tab | undefined;
    public opened_ext_tabs: TabsExt.Tab[] = [];
    public ext_protocol: string = `${env.browser}-extension://`;
    private ext_match_pattern: string = `${this.ext_protocol}*/*`;

    public open_background_tab = ({ force = false }: { force?: boolean } = {}): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (settings.open_background_tab_automatically || force) {
                const tabs = await we.tabs.query({ url: this.background_path_url });
                const background_tab_is_not_opened = tabs.length === 0;

                if (background_tab_is_not_opened) {
                    this.background_tab = await we.tabs.create({
                        url: this.background_path_url,
                        index: settings.open_position_in_tab_strip,
                        pinned: true,
                    });
                }
            }
        }, 'aer_1098');

    public get_tabs = (): Promise<TabsExt.Tab[]> =>
        err_async(async () => {
            const tabs: TabsExt.Tab[] = await we.tabs.query({});

            const tabs_filtered: TabsExt.Tab[] = tabs.filter((tab: TabsExt.Tab): boolean =>
                err(() => !this.check_if_excluded_tab({ url: tab.url }), 'aer_1090'),
            );

            return tabs_filtered;
        }, 'aer_1087');

    public get_ext_tabs = (): Promise<TabsExt.Tab[]> =>
        err_async(async () => {
            const tabs: TabsExt.Tab[] = await we.tabs.query({
                url: this.ext_match_pattern,
            });

            return tabs;
        }, 'aer_1027');

    private check_if_excluded_tab = ({ url }: { url: string | undefined }): boolean =>
        err(
            () =>
                n(url) &&
                (url === 'chrome://extensions/' ||
                    url.includes(`${this.ext_protocol}${we.runtime.id}`)),
            'aer_1091',
        );

    public reload_tabs = ({ all_tabs }: { all_tabs: boolean }): Promise<void> =>
        err_async(async () => {
            const tabs: TabsExt.Tab[] = await this.get_tabs();

            if (all_tabs) {
                await Promise.all(
                    tabs.map(async (ext_tab: TabsExt.Tab) =>
                        err_async(async () => {
                            await we.tabs.reload(ext_tab.id);
                        }, 'aer_1083'),
                    ),
                );
            } else {
                const current_tab: TabsExt.Tab | undefined = await ext.get_active_tab();

                if (n(current_tab) && !this.check_if_excluded_tab({ url: current_tab.url })) {
                    await we.tabs.reload(current_tab.id);
                }
            }
        }, 'aer_1007');

    public recreate_tabs = ({
        ext,
        ext_tabs,
    }: {
        ext: Management.ExtensionInfo;
        ext_tabs: i_reload.TabWithExtId[];
    }): Promise<void> =>
        err_async(async () => {
            await Promise.all(
                ext_tabs.map(async (text_tab: i_reload.TabWithExtId) =>
                    err_async(async () => {
                        if (text_tab.ext_id === ext.id) {
                            await we.tabs.create({
                                windowId: text_tab.windowId,
                                index: text_tab.index,
                                url: text_tab.url,
                                active: text_tab.active,
                                pinned: text_tab.pinned,
                            });
                        }
                    }, 'aer_1085'),
                ),
            );
        }, 'aer_1086');

    public get_page_tab = ({
        page,
    }: {
        page: 'settings' | 'background_tab';
    }): Promise<TabsExt.Tab | { id: number }> =>
        err_async(async () => {
            const tabs: TabsExt.Tab[] = await we.tabs.query({
                url: we.runtime.getURL(`${page}.html`),
            });

            return n(tabs[0]) ? tabs[0] : { id: 0 };
        }, 'aer_1056');

    public reload_background_tab_page_tab = (): Promise<void> =>
        err(async () => {
            const background_tab_tab = await this.get_page_tab({
                page: 'background_tab',
            });

            we.tabs.reload(background_tab_tab.id);
        }, 'aer_1057');
}

we.tabs.onRemoved.addListener(
    (tab_id: number): Promise<void> =>
        err_async(async () => {
            if (n(Tabs.i().background_tab) && tab_id === Tabs.i().background_tab!.id) {
                Tabs.i().open_background_tab();
            }
        }, 'aer_1097'),
);

we.tabs.onUpdated.addListener(
    (tab_id: number, change_info): Promise<void> =>
        err_async(async () => {
            if (change_info.status === 'complete') {
                const tabs = await we.tabs.query({ url: Tabs.i().background_path_url });
                const more_than_1_background_tab_is_opened = tabs.length > 1;

                if (more_than_1_background_tab_is_opened) {
                    we.tabs.remove(tab_id);
                }
            }
        }, 'aer_1097'),
);
