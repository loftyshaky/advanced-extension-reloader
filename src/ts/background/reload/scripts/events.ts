import { Menus } from 'webextension-polyfill';

import { i_options } from 'shared_clean/internal';
import { s_reload } from 'background/internal';

we.action.onClicked.addListener(
    (): Promise<void> =>
        err_async(async () => {
            const click_action = await ext.storage_get('click_action');

            s_reload.Watch.try_to_reload({
                options: click_action.click_action,
            });
        }, 'aer_1013'),
);

we.contextMenus.onClicked.addListener(
    (info: Menus.OnClickData): Promise<void> =>
        err_async(async () => {
            if (info.menuItemId === 'suspend_or_resume_automatic_reload') {
                s_reload.Watch.suspend_or_resume_automatic_reload();
            } else {
                const settings = await ext.storage_get();

                s_reload.Watch.try_to_reload({
                    options: settings.context_menu_actions[info.menuItemId],
                });
            }
        }, 'aer_1018'),
);

we.commands.onCommand.addListener(
    async (command: string): Promise<void> =>
        err_async(async () => {
            if (command === 'suspend_or_resume_automatic_reload') {
                s_reload.Watch.suspend_or_resume_automatic_reload();
            } else {
                const settings = await ext.storage_get(['click_action', 'context_menu_actions']);
                let reload_action: i_options.Options = settings.click_action;

                if (command !== 'reload_main') {
                    const reload_action_i: number = +command.replace(/\D/g, '') - 1;

                    reload_action = settings.context_menu_actions[reload_action_i];
                }

                if (n(reload_action)) {
                    s_reload.Watch.try_to_reload({
                        options: reload_action,
                    });
                }
            }
        }, 'aer_1020'),
);
