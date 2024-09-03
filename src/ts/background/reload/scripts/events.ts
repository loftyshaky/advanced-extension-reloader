import { Menus } from 'webextension-polyfill';

import { s_reload } from 'background/internal';

we.action.onClicked.addListener(
    (): Promise<void> =>
        err_async(async () => {
            s_reload.Watch.try_to_reload({
                options: data.settings.prefs.click_action,
            });
        }, 'aer_1013'),
);

we.contextMenus.onClicked.addListener(
    (info: Menus.OnClickData): Promise<void> =>
        err_async(async () => {
            if (info.menuItemId === 'pause_or_resume_automatic_reload') {
                s_reload.Watch.pause_or_resume_automatic_reload();
            } else {
                s_reload.Watch.try_to_reload({
                    options: data.settings.prefs.context_menu_actions[info.menuItemId],
                });
            }
        }, 'aer_1018'),
);

we.commands.onCommand.addListener(
    async (command: string): Promise<void> =>
        err_async(async () => {
            if (command === 'pause_or_resume_automatic_reload') {
                s_reload.Watch.pause_or_resume_automatic_reload();
            } else {
                const reload_action_i: number = +command.replace(/\D/g, '') - 1;
                const reload_action = data.settings.prefs.context_menu_actions[reload_action_i];

                if (n(reload_action)) {
                    s_reload.Watch.try_to_reload({
                        options: reload_action,
                    });
                }
            }
        }, 'aer_1020'),
);
