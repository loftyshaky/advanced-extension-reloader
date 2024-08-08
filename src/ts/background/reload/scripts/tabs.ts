import { Windows, Tabs as TabsExt } from 'webextension-polyfill';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public ext_tabs: TabsExt.Tab[] = [];
    public browser_protocol: string = 'chrome://';
    public ext_protocol: string = 'chrome-extension://';
    public temporary_tabs: TabsExt.Tab[] = [];
    private new_tab_link: string = `${this.browser_protocol}newtab/`;

    public get_tabs = (): Promise<TabsExt.Tab[]> =>
        err_async(async () => {
            const tabs: TabsExt.Tab[] = await we.tabs.query({});

            const tabs_filtered: TabsExt.Tab[] = tabs.filter((tab: TabsExt.Tab): boolean =>
                err(() => !this.check_if_excluded_tab({ url: tab.url }), 'aer_1022'),
            );

            return tabs_filtered;
        }, 'aer_1023');

    public get_ext_tabs = (): Promise<TabsExt.Tab[]> =>
        err_async(async () => {
            const tabs: TabsExt.Tab[] = await we.tabs.query({
                url: [`${this.browser_protocol}*/*`, `${this.ext_protocol}*/*`],
            });

            return tabs;
        }, 'aer_1024');

    public get_new_tab_tabs = (): Promise<TabsExt.Tab[]> =>
        err_async(async () => {
            const tabs: TabsExt.Tab[] = await we.tabs.query({
                url: [this.new_tab_link],
            });

            return tabs;
        }, 'aer_1024');

    private check_if_excluded_tab = ({ url }: { url: string | undefined }): boolean =>
        err(
            () =>
                n(url) &&
                (url === `${env.browser}://extensions/` ||
                    url.includes(`${this.ext_protocol}${we.runtime.id}`)),
            'aer_1025',
        );

    public reload_tabs = ({
        hard,
        all_tabs,
    }: {
        hard: boolean;
        all_tabs: boolean;
    }): Promise<void> =>
        err_async(async () => {
            const check_if_excluded_tab_hard = ({ url }: { url: string | undefined }): boolean =>
                err(() => {
                    const reg_exp_extension = new RegExp(this.ext_protocol);
                    const reg_exp_browser = new RegExp(this.browser_protocol);

                    let is_extension_tab: boolean = false;
                    if (n(url)) {
                        is_extension_tab = reg_exp_extension.test(url) || reg_exp_browser.test(url);
                    }

                    return hard ? is_extension_tab : false;
                }, 'aer_1026');

            const tab_is_idle = ({ tab }: { tab: TabsExt.Tab }): boolean =>
                err(() => tab.status !== 'loading', 'aer_1098'); // without this refresh button in browser will not work in extension pages after hard reload

            const tabs: TabsExt.Tab[] = await this.get_tabs();

            if (all_tabs) {
                await Promise.all(
                    tabs.map(async (ext_tab: TabsExt.Tab) =>
                        err_async(async () => {
                            if (
                                !check_if_excluded_tab_hard({ url: ext_tab.url }) &&
                                tab_is_idle({ tab: ext_tab })
                            ) {
                                await we.tabs.reload(ext_tab.id);
                            }
                        }, 'aer_1027'),
                    ),
                );
            } else {
                const current_tab: TabsExt.Tab | undefined = await ext.get_active_tab();

                if (
                    n(current_tab) &&
                    !this.check_if_excluded_tab({ url: current_tab.url }) &&
                    !check_if_excluded_tab_hard({ url: current_tab.url }) &&
                    tab_is_idle({ tab: current_tab })
                ) {
                    await we.tabs.reload(current_tab.id);
                }
            }
        }, 'aer_1028');

    public recreate_tabs = ({ ext_tabs }: { ext_tabs: TabsExt.Tab[] }): Promise<void> =>
        err_async(async () => {
            await Promise.all(
                ext_tabs.map(async (text_tab: TabsExt.Tab) =>
                    err_async(async () => {
                        const window_has_temporary_tab = this.temporary_tabs.some(
                            (temporary_tab: TabsExt.Tab): boolean =>
                                err(() => temporary_tab.windowId === text_tab.windowId, 'aer_1123'),
                        );
                        const tab: TabsExt.Tab = await we.tabs.create({
                            windowId: text_tab.windowId,
                            index: window_has_temporary_tab ? text_tab.index + 1 : text_tab.index,
                            url: text_tab.url,
                            active: false, // prevent focus stealing on Ubuntu when extension's tab is reopened
                            pinned: text_tab.pinned,
                        });

                        //> prevent focus stealing on Ubuntu when extension's tab is reopened
                        if (text_tab.active) {
                            await we.tabs.update(tab.id, {
                                active: true,
                            });
                        }
                        //< prevent focus stealing on Ubuntu when extension's tab is reopened
                    }, 'aer_1029'),
                ),
            );
        }, 'aer_1030');

    public get_page_tab = ({ page }: { page: 'settings' }): Promise<TabsExt.Tab | { id: number }> =>
        err_async(async () => {
            const tabs: TabsExt.Tab[] = await we.tabs.query({
                url: we.runtime.getURL(`${page}.html`),
            });

            return n(tabs[0]) ? tabs[0] : { id: 0 };
        }, 'aer_1031');

    public create_temporary_tabs = (): Promise<void> =>
        err_async(async () => {
            const windows: Windows.Window[] = await we.windows.getAll();

            windows.forEach(
                (window: Windows.Window): Promise<void> =>
                    err_async(async () => {
                        this.temporary_tabs = [];

                        const tabs: TabsExt.Tab[] = await we.tabs.query({ windowId: window.id });

                        const tabs_that_wont_reload: TabsExt.Tab[] = tabs.filter(
                            (tab: TabsExt.Tab): boolean =>
                                err(() => {
                                    const is_new_tab_tab: boolean = tab.url === this.new_tab_link;
                                    const is_ext_to_reaload_tab: boolean = this.ext_tabs.some(
                                        (ext_tab: TabsExt.Tab): boolean =>
                                            err(() => tab.url === ext_tab.url, 'aer_1122'),
                                    );

                                    return !is_new_tab_tab && !is_ext_to_reaload_tab;
                                }, 'aer_1121'),
                        );

                        if (tabs_that_wont_reload.length === 0) {
                            const created_tab: TabsExt.Tab = await we.tabs.create({
                                url: 'about:blank',
                                windowId: window.id,
                                index: 0,
                                active: false,
                                pinned: true,
                            });

                            if (n(created_tab.id)) {
                                this.temporary_tabs.push(created_tab);
                            }
                        }
                    }, 'aer_1118'),
            );
        }, 'aer_1117');

    public remove_temporary_tabs = (): Promise<void> =>
        err_async(async () => {
            await Promise.all(
                this.temporary_tabs.map(
                    async (tab: TabsExt.Tab): Promise<void> =>
                        err_async(async () => {
                            await we.tabs.remove(tab.id);
                        }, 'aer_1120'),
                ),
            );
        }, 'aer_1119');
}

export const Tabs = Class.get_instance();
