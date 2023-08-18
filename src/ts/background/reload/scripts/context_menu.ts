import _ from 'lodash';
import { Management } from 'webextension-polyfill-ts';

import { i_options } from 'shared/internal';
import { s_data, s_reload } from 'background/internal';

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
            const settings = await ext.storage_get();

            await we.contextMenus.removeAll();

            await we.contextMenus.create({
                id: 'suspend_automatic_reload',
                title: ext.msg(
                    `${
                        settings.suspend_automatic_reload
                            ? 'resume_automatic_reload'
                            : 'suspend_automatic_reload'
                    }_context_menu_item`,
                ),
                contexts: ['action'],
            });

            if (n(settings.context_menu_actions)) {
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

                            const context_menu_item_title_final: string =
                                app_name === ''
                                    ? _.upperFirst(context_menu_item_title)
                                    : context_menu_item_title;

                            await we.contextMenus.create({
                                id: `${i}`,
                                title: context_menu_item_title_final,
                                contexts: ['action'],
                            });
                        }, 'aer_1016'),
                );
            }
        }, 'aer_1017');
}

we.contextMenus.onClicked.addListener(
    (info): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get();

            if (info.menuItemId === 'suspend_automatic_reload') {
                settings.suspend_automatic_reload = !settings.suspend_automatic_reload;

                await s_data.Main.i().update_settings({ settings });
            } else {
                s_reload.Watch.i().try_to_reload({
                    options: settings.context_menu_actions[info.menuItemId],
                });
            }
        }, 'aer_1018'),
);
