import _ from 'lodash';
import {
    browser,
    Management,
    Windows,
    Tabs as TabsExt,
} from 'webextension-polyfill-ts';

import { s_reload } from 'background/internal';

export class Tabs {
    private static i0: Tabs;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    public last_active_tab_id: number = 0;
    public opened_tabs: TabsExt.Tab[] = [];

    public set_last_active_tab_id = (): Promise<void> => err_async(async () => {
        const tab: TabsExt.Tab | undefined = await ext.get_active_tab();

        if (
            n(tab)
            && n(tab.id)
        ) {
            Tabs.i.last_active_tab_id = tab.id;
        }
    },
    1031);

    public get_opened_ext_tabs = (): Promise<void> => err_async(async () => {
        if (!s_reload.Watch.i.reloading) {
            const this_ext: Management.ExtensionInfo = await browser.management.getSelf();
            const all_window_tabs: TabsExt.Tab[] = await browser.tabs.query({});

            this.opened_tabs = all_window_tabs.filter((tab: TabsExt.Tab): boolean => {
                if (n(tab.url)) {
                    return (
                        tab.url.includes('chrome-extension://')
                        && !tab.url.includes(this_ext.id)
                    );
                }

                return false;
            });
        }
    },
    1027);

    public reload_all_tabs = (): Promise<void> => err_async(async () => {
        const wins: Windows.Window[] = await browser.windows.getAll({ populate: true });

        wins.forEach((win: Windows.Window): void => {
            if (n(win.tabs)) {
                win.tabs.forEach((tab: TabsExt.Tab): void => {
                    browser.tabs.reload(tab.id);
                });
            }
        });
    },
    1007);

    public recreate_tab = ({ tab }: { tab: TabsExt.Tab }): Promise<void> => err_async(async () => {
        try {
            await browser.tabs.create({
                windowId: tab.windowId,
                index: tab.index,
                url: tab.url,
                active: tab.active,
                pinned: tab.pinned,
            });
        } catch (error_obj) {
            show_err_ribbon(
                error_obj,
                1033,
            );
        }

        this.opened_tabs = _.reject(
            this.opened_tabs,
            (tab_to_reject: TabsExt.Tab) => tab_to_reject.id === tab.id,
        );
    },
    1032);
}

browser.windows.onFocusChanged.addListener((): Promise<void> => err_async(async () => {
    Tabs.i.set_last_active_tab_id();
    Tabs.i.get_opened_ext_tabs();
},
1009));

browser.tabs.onActivated.addListener((): void => err(() => {
    Tabs.i.set_last_active_tab_id();
    Tabs.i.get_opened_ext_tabs();
},
1010));

browser.tabs.onUpdated.addListener((
    tab_id: number,
    info: TabsExt.OnUpdatedChangeInfoType,
): void => err(() => {
    if (info.status === 'complete') {
        Tabs.i.get_opened_ext_tabs();
    }
},
1028));

browser.tabs.onMoved.addListener((): void => err(() => {
    Tabs.i.get_opened_ext_tabs();
},
1029));

browser.tabs.onRemoved.addListener((): void => err(() => {
    Tabs.i.get_opened_ext_tabs();
},
1030));
