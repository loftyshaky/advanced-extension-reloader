import _ from 'lodash';
import { Management } from 'webextension-polyfill-ts';

import { i_options } from 'shared/internal';
import { s_reload } from 'background/internal';

export class ContextMenu {
    private static i0: ContextMenu;

    public static i(): ContextMenu {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public create = (): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get('context_menu_actions');

            await we.contextMenus.removeAll();

            await we.contextMenus.create({
                id: 'open_background_tab',
                title: 'Open background tab',
                contexts: ['action'],
            });

            const background_tab_tab = await s_reload.Tabs.i().get_page_tab({
                page: 'background_tab',
            });
            const found_background_tab = n(background_tab_tab);

            if (found_background_tab && n(settings.context_menu_actions)) {
                const apps_info: Management.ExtensionInfo[] = await we.management.getAll();

                const get_ext_info_with_id = ({
                    reload_action,
                }: {
                    reload_action: i_options.Options;
                }): Management.ExtensionInfo | undefined =>
                    err(
                        () =>
                            typeof reload_action.ext_id === 'string'
                                ? apps_info.find((ext_info: Management.ExtensionInfo): boolean =>
                                      err(() => ext_info.id === reload_action.ext_id, 'aer_1014'),
                                  )
                                : undefined,
                        'aer_1015',
                    );

                settings.context_menu_actions.forEach(
                    (reload_action: i_options.Options, i: number): Promise<void> =>
                        err_async(async () => {
                            const reload_actions_final: i_options.Options =
                                s_reload.DefaultValues.i().tranform_reload_action({
                                    reload_action,
                                });

                            const matched_ext_info: Management.ExtensionInfo | undefined =
                                get_ext_info_with_id({ reload_action: reload_actions_final });

                            const app_name: string = n(matched_ext_info)
                                ? `${matched_ext_info.name} + `
                                : '';
                            const context_menu_item_title: string = `${app_name}${
                                reload_actions_final.hard ? 'hard' : 'soft'
                            } + ${reload_actions_final.all_tabs ? 'all tabs' : 'one tab'}`;
                            if (n(background_tab_tab.id)) {
                                const context_menu_item_title_final: string =
                                    app_name === ''
                                        ? _.upperFirst(context_menu_item_title)
                                        : context_menu_item_title;

                                await we.contextMenus.create({
                                    id: `${i}`,
                                    title: context_menu_item_title_final,
                                    contexts: ['action'],
                                });
                            }
                        }, 'aer_1016'),
                );
            }
        }, 'aer_1017');
}

we.contextMenus.onClicked.addListener(
    (info): Promise<void> =>
        err_async(async () => {
            if (info.menuItemId === 'open_background_tab') {
                s_reload.Tabs.i().open_background_tab({ force: true });
            } else {
                const settings = await ext.storage_get(['click_action', 'context_menu_actions']);

                s_reload.Watch.i().try_to_reload({
                    options: settings.context_menu_actions[info.menuItemId],
                });
            }
        }, 'aer_1018'),
);
