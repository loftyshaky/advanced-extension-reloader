import _ from 'lodash';
import { browser } from 'webextension-polyfill-ts';

import {
    s_reload,
    i_reload,
} from 'background/internal';

export class ContextMenu {
    private static i0: ContextMenu;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    public create = (): Promise<void> => err_async(async () => {
        const settings = await ext.storage_get('reload_actions');

        await browser.contextMenus.removeAll();

        if (n(settings.reload_actions)) {
            settings.reload_actions.forEach((reload_action: i_reload.Options): void => err(() => {
                browser.contextMenus.create({
                    title: _.capitalize(
                        `${reload_action.hard
                            ? ext.msg('hard_context_menu_item')
                            : ext.msg('soft_context_menu_item')} + ${reload_action.all_tabs
                            ? ext.msg('all_tabs_context_menu_item')
                            : ext.msg('one_tab_context_menu_item')}`,
                    ),
                    contexts: ['browser_action'],
                    onclick: (): void => { s_reload.Watch.i.reload(reload_action); },
                });
            },
            1021));
        }
    },
    1020);
}
