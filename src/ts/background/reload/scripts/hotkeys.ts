import { browser } from 'webextension-polyfill-ts';

import { i_options } from 'shared/internal';
import { s_reload } from 'background/internal';

browser.commands.onCommand.addListener(
    async (command: string): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get(['click_action', 'reload_actions']);
            let reload_action: i_options.Options = settings.click_action;

            if (command !== 'reload_main') {
                const reload_action_i: number = +command.replace(/\D/g, '') - 1;

                reload_action = settings.reload_actions[reload_action_i];
            }

            if (n(reload_action)) {
                s_reload.Watch.i().reload(reload_action);
            }
        }, 'aer_1044'),
);
