import type { Management } from 'webextension-polyfill';

import upperFirst from 'lodash/upperFirst';

import { s_reload } from 'background/internal';
import type { i_options } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    private creating_context_menu: boolean = false; // prevent "Suspend/resume automatic reload at the bottom"

    public create = (): Promise<void> =>
        err_async(async () => {
            if (!this.creating_context_menu) {
                this.creating_context_menu = true;

                await we.contextMenus.removeAll();

                we.contextMenus.create({
                    id: 'reload_options',
                    title: ext.msg('reload_options_context_menu_item'),
                    contexts: ['action'],
                });

                we.contextMenus.create({
                    id: 'pause_or_resume_automatic_reload',
                    parentId: 'reload_options',
                    title: ext.msg(
                        `${
                            data.settings.prefs.pause_automatic_reload
                                ? 'resume_automatic_reload'
                                : 'pause_automatic_reload'
                        }_context_menu_item`,
                    ),
                    contexts: ['action'],
                });

                we.contextMenus.create({
                    id: 'enable_or_disable_automatic_tab_reload',
                    parentId: 'reload_options',
                    title: ext.msg(
                        `${
                            data.settings.prefs.disable_automatic_tab_reload
                                ? 'enable_automatic_tab_reload'
                                : 'disable_automatic_tab_reload'
                        }_context_menu_item`,
                    ),
                    contexts: ['action'],
                });

                we.contextMenus.create({
                    id: 'enable_or_disable_manual_tab_reload',
                    parentId: 'reload_options',
                    title: ext.msg(
                        `${
                            data.settings.prefs.disable_manual_tab_reload
                                ? 'enable_manual_tab_reload'
                                : 'disable_manual_tab_reload'
                        }_context_menu_item`,
                    ),
                    contexts: ['action'],
                });

                if (n(data.settings.prefs.context_menu_actions)) {
                    const apps_info: Management.ExtensionInfo[] = await we.management.getAll();

                    const get_ext_info_with_id = ({
                        reload_action,
                    }: {
                        reload_action: i_options.Options;
                    }): Management.ExtensionInfo | undefined =>
                        err(
                            () =>
                                typeof reload_action.extension_id === 'string'
                                    ? apps_info.find(
                                          (ext_info: Management.ExtensionInfo): boolean =>
                                              err(
                                                  () => ext_info.id === reload_action.extension_id,
                                                  'aer_1014',
                                              ),
                                      )
                                    : undefined,
                            'aer_1015',
                        );

                    let more_reload_actions_context_menu_item_id: string | undefined = undefined;

                    data.settings.prefs.context_menu_actions.forEach(
                        (reload_action: i_options.Options, i: number): Promise<void> =>
                            err_async(async () => {
                                const reload_actions_final: i_options.Options =
                                    s_reload.DefaultValues.tranform_reload_action({
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
                                        ? upperFirst(context_menu_item_title)
                                        : context_menu_item_title;

                                if (
                                    i === 4 &&
                                    data.settings.prefs.context_menu_actions.length > 5
                                ) {
                                    more_reload_actions_context_menu_item_id =
                                        'more_reload_actions';

                                    we.contextMenus.create({
                                        id: more_reload_actions_context_menu_item_id,
                                        title: ext.msg('more_reload_actions_context_menu_item'),
                                        contexts: ['action'],
                                    });
                                }

                                we.contextMenus.create({
                                    id: `${i}`,
                                    parentId: more_reload_actions_context_menu_item_id,
                                    title: context_menu_item_title_final,
                                    contexts: ['action'],
                                });
                            }, 'aer_1016'),
                    );
                }

                this.creating_context_menu = false;
            }
        }, 'aer_1017');
}
export const ContextMenu = Class.get_instance();
