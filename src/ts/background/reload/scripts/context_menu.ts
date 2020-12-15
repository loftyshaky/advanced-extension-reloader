import _ from 'lodash';
import {
    browser,
    Management,
} from 'webextension-polyfill-ts';

import { i_shared } from 'shared/internal';

import { s_reload } from 'background/internal';

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
            const apps_info: Management.ExtensionInfo[] = await browser.management.getAll();

            const get_app_info_with_id = (
                { reload_action }:
                { reload_action: i_shared.Options },
            ): Management.ExtensionInfo | undefined => err(() => (
                (reload_action.ext_id)
                    ? apps_info.find(
                        (app_info: Management.ExtensionInfo): boolean => (
                            app_info.id === reload_action.ext_id
                        ),
                    )
                    : undefined
            ),
            1043);

            settings.reload_actions.forEach((reload_action: i_shared.Options): void => err(() => {
                const matched_app_info: Management.ExtensionInfo | undefined = (
                    get_app_info_with_id({ reload_action })
                );

                const app_name: string = n(matched_app_info)
                    ? `${matched_app_info.name} + `
                    : '';
                browser.contextMenus.create({
                    title: _.capitalize(
                        `${app_name}${reload_action.hard
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
