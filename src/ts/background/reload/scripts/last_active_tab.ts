import { browser, Tabs } from 'webextension-polyfill-ts';

// eslint-disable-next-line import/no-mutable-exports
export let last_active_tab: number = 0;

(async (): Promise<void> => {
    const tab: Tabs.Tab | undefined = await ext.get_active_tab();

    if (
        n(tab)
        && n(tab.id)
    ) {
        last_active_tab = tab.id;
    }
})();

browser.windows.onFocusChanged.addListener((): Promise<void> => err(async () => {
    const tab: Tabs.Tab | undefined = await ext.get_active_tab();

    if (
        n(tab)
        && n(tab.id)
    ) {
        last_active_tab = tab.id;
    }
},
1009));

browser.tabs.onActivated.addListener((info: Tabs.OnActivatedActiveInfoType): void => err(() => {
    last_active_tab = info.tabId;
},
1010));
