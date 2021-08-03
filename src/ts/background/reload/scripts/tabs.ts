import { browser, Windows, Tabs as TabsExt } from 'webextension-polyfill-ts';

export class Tabs {
    private static i0: Tabs;

    public static i(): Tabs {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public last_active_tab_id: number = 0;

    public set_last_active_tab_id = (): Promise<void> =>
        err_async(async () => {
            const tab: TabsExt.Tab | undefined = await ext.get_active_tab();

            if (n(tab) && n(tab.id)) {
                Tabs.i().last_active_tab_id = tab.id;
            }
        }, 'aer_1031');

    public get_opened_ext_tabs = ({ urls }: { urls: string[] }): Promise<TabsExt.Tab[]> =>
        err_async(async () => {
            const all_window_tabs: TabsExt.Tab[] = await browser.tabs.query({});

            const includes_url = ({ tab }: { tab: TabsExt.Tab }): boolean =>
                urls.some((url: string): boolean =>
                    err(() => n(tab.url) && tab.url.includes(url), 'aer_1029'),
                );

            const opened_ext_tab: TabsExt.Tab[] = all_window_tabs.filter(
                (tab: TabsExt.Tab): boolean => err(() => includes_url({ tab }), 'aer_1030'),
            );

            return opened_ext_tab;
        }, 'aer_1027');

    public reload_all_tabs = (): Promise<void> =>
        err_async(async () => {
            const wins: Windows.Window[] = await browser.windows.getAll({ populate: true });

            wins.forEach((win: Windows.Window): void => {
                if (n(win.tabs)) {
                    win.tabs.forEach((tab: TabsExt.Tab): void => {
                        browser.tabs.reload(tab.id);
                    });
                }
            });
        }, 'aer_1007');

    public recreate_tab = ({ tab }: { tab: TabsExt.Tab }): Promise<void> =>
        err_async(async () => {
            try {
                await browser.tabs.create({
                    windowId: tab.windowId,
                    index: tab.index,
                    url: tab.url,
                    active: tab.active,
                    pinned: tab.pinned,
                });
            } catch (error_obj) {
                show_err_ribbon(error_obj, 'aer_1033');
            }
        }, 'aer_1032');

    public get_background_tab_page_tab = (): Promise<TabsExt.Tab> =>
        err(async () => {
            const tabs: TabsExt.Tab[] = await browser.tabs.query({
                url: we.runtime.getURL('background_tab.html'),
            });

            return tabs[0];
        }, 'aer_1056');

    public reload_background_tab_page_tab = (): Promise<void> =>
        err(async () => {
            const background_tab_tab: TabsExt.Tab = await this.get_background_tab_page_tab();

            we.tabs.reload(background_tab_tab.id);
        }, 'aer_1057');
}

browser.windows.onFocusChanged.addListener(
    (): Promise<void> =>
        err_async(async () => {
            Tabs.i().set_last_active_tab_id();
        }, 'aer_1009'),
);

browser.tabs.onActivated.addListener((): void =>
    err(() => {
        Tabs.i().set_last_active_tab_id();
    }, 'aer_1010'),
);
