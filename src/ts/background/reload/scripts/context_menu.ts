import { browser, Management } from 'webextension-polyfill-ts';

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
            const settings = await ext.storage_get('reload_actions');

            await browser.contextMenus.removeAll();

            const background_tab_tab = await s_reload.Tabs.i().get_page_tab({
                page: 'background_tab',
            });
            const found_background_tab = n(background_tab_tab);

            if (found_background_tab && n(settings.reload_actions)) {
                const apps_info: Management.ExtensionInfo[] = await browser.management.getAll();

                const get_app_info_with_id = ({
                    reload_action,
                }: {
                    reload_action: i_options.Options;
                }): Management.ExtensionInfo | undefined =>
                    err(
                        () =>
                            typeof reload_action.ext_id === 'string'
                                ? apps_info.find(
                                      (app_info: Management.ExtensionInfo): boolean =>
                                          app_info.id === reload_action.ext_id,
                                  )
                                : undefined,
                        'aer_1043',
                    );

                settings.reload_actions.forEach(
                    (reload_action: i_options.Options, i: number): Promise<void> =>
                        err_async(async () => {
                            const reload_actions_final: i_options.Options =
                                s_reload.DefaultValues.i().tranform_reload_action({
                                    reload_action,
                                });

                            const matched_app_info: Management.ExtensionInfo | undefined =
                                get_app_info_with_id({ reload_action: reload_actions_final });

                            const app_name: string = n(matched_app_info)
                                ? `${matched_app_info.name} + `
                                : '';
                            if (n(background_tab_tab.id)) {
                                const context_menu_item_title: string =
                                    await ext.send_msg_to_tab_resp(background_tab_tab.id, {
                                        msg: 'generate_context_menu_item_text',
                                        app_name,
                                        reload_actions: reload_actions_final,
                                    });

                                await browser.contextMenus.create({
                                    id: `${i}`,
                                    title: context_menu_item_title,
                                    contexts: ['action'],
                                });
                            }
                        }, 'aer_1021'),
                );
            }
        }, 'aer_1020');
}
