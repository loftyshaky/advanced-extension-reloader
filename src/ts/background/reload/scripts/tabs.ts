import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import { Windows, Tabs as TabsExt } from 'webextension-polyfill';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public pending_tabs_recreate: boolean = false;
    public ext_tabs_recreate: TabsExt.Tab[] = [];
    public ext_tabs: TabsExt.Tab[] = [];
    public new_tab_tabs: TabsExt.Tab[] = [];
    public browser_protocol: string = '';
    public ext_protocol: string = '';
    public temporary_tabs: TabsExt.Tab[] = [];
    public new_tab_link: string = '';
    private temp_page_link: string = we.runtime.getURL('temp.html');
    private active_tab_id: number = 0;

    public set_extension_urls = (): Promise<void> =>
        err_async(async () => {
            this.browser_protocol = `${env.browser}://`;
            this.ext_protocol = 'chrome-extension://';

            this.new_tab_link = `${this.browser_protocol}newtab/`;
        }, 'aer_1152');

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
        }, 'aer_1153');

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
            let one_of_restored_tabs_was_active: boolean = false;
            await Promise.all(
                sortBy(ext_tabs, 'index').map(async (ext_tab: TabsExt.Tab) =>
                    err_async(async () => {
                        const window_has_temporary_tab = this.temporary_tabs.some(
                            (temporary_tab: TabsExt.Tab): boolean =>
                                err(() => temporary_tab.windowId === ext_tab.windowId, 'aer_1123'),
                        );
                        const remaining_new_tabs: TabsExt.Tab[] = await we.tabs.query({
                            url: this.new_tab_link,
                        });
                        const all_new_tabs_were_closed_during_extension_reload: boolean =
                            remaining_new_tabs.length === 0;

                        if (
                            env.browser === 'chrome' ||
                            (env.browser === 'edge' &&
                                (all_new_tabs_were_closed_during_extension_reload ||
                                    ext_tab.url !== this.new_tab_link))
                        ) {
                            const tab: TabsExt.Tab = await we.tabs.create({
                                windowId: ext_tab.windowId,
                                index: window_has_temporary_tab ? ext_tab.index + 1 : ext_tab.index,
                                url: ext_tab.url,
                                active: false, // prevent focus stealing on Ubuntu when extension's tab is reopened
                                pinned: ext_tab.pinned,
                            });

                            //> prevent focus stealing on Ubuntu when extension's tab is reopened
                            if (ext_tab.active) {
                                one_of_restored_tabs_was_active = true;

                                await we.tabs.update(tab.id, {
                                    active: true,
                                });
                            }
                        }
                        //< prevent focus stealing on Ubuntu when extension's tab is reopened

                        if (!one_of_restored_tabs_was_active) {
                            await we.tabs.update(this.active_tab_id, {
                                active: true,
                            });
                        }
                    }, 'aer_1029'),
                ),
            );

            this.reset_vars();
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

            const active_tab: TabsExt.Tab = await ext.get_active_tab();
            const last_focused_window: Windows.Window = await we.windows.getLastFocused();
            this.temporary_tabs = [];

            if (n(active_tab.id)) {
                this.active_tab_id = active_tab.id;
            }

            // eslint-disable-next-line no-restricted-syntax
            for await (const window of windows) {
                const temporary_tabs_old: TabsExt.Tab[] = cloneDeep(this.temporary_tabs);
                const tabs: TabsExt.Tab[] = await we.tabs.query({ windowId: window.id });

                const tabs_that_wont_reload: TabsExt.Tab[] = tabs.filter(
                    (tab: TabsExt.Tab): boolean =>
                        err(() => {
                            const is_new_tab_tab: boolean = tab.url === this.new_tab_link;
                            const is_browser_close_protect_tab: boolean =
                                tab.url === this.temp_page_link;
                            const is_ext_to_reaload_tab: boolean = this.ext_tabs.some(
                                (ext_tab: TabsExt.Tab): boolean =>
                                    err(() => tab.url === ext_tab.url, 'aer_1122'),
                            );

                            return (
                                ((env.browser === 'chrome' && !is_new_tab_tab) ||
                                    (env.browser === 'edge' && is_new_tab_tab)) &&
                                !is_ext_to_reaload_tab &&
                                !is_browser_close_protect_tab
                            );
                        }, 'aer_1121'),
                );

                const has_browser_close_protect_tab: boolean = tabs.some(
                    (tab: TabsExt.Tab): boolean =>
                        err(() => {
                            const is_browser_close_protect_tab: boolean =
                                tab.url === this.temp_page_link;

                            return is_browser_close_protect_tab;
                        }, 'aer_1134'),
                );

                if (has_browser_close_protect_tab) {
                    this.temporary_tabs = temporary_tabs_old;
                } else if (tabs_that_wont_reload.length === 0 || env.browser === 'edge') {
                    const created_tab: TabsExt.Tab = await we.tabs.create({
                        url: this.temp_page_link,
                        windowId: window.id,
                        index: 0,
                        active: false, // prevent focus stealing on Ubuntu when extension's tab is reopened
                        pinned: true,
                    });

                    //> prevent focus stealing on Ubuntu when extension's tab is reopened
                    await we.tabs.update(created_tab.id, {
                        active: window.id === last_focused_window.id && env.browser === 'edge',
                    });
                    //< prevent focus stealing on Ubuntu when extension's tab is reopened

                    if (n(created_tab.id)) {
                        this.temporary_tabs.push(created_tab);
                    }
                }
            }
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

    public reset_vars = (): void =>
        err(() => {
            this.ext_tabs_recreate = [];
            this.ext_tabs = [];
            this.new_tab_tabs = [];
            this.pending_tabs_recreate = false;
        }, 'aer_1140');
}

export const Tabs = Class.get_instance();
