import { i_options } from 'shared/internal';
import { s_reload } from 'background/internal';

we.commands.onCommand.addListener(
    async (command: string): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get(['click_action', 'context_menu_actions']);
            let reload_action: i_options.Options = settings.click_action;

            if (command !== 'reload_main') {
                const reload_action_i: number = +command.replace(/\D/g, '') - 1;

                reload_action = settings.context_menu_actions[reload_action_i];
            }

            if (n(reload_action)) {
                s_reload.Watch.i().generate_reload_debounce_and_run_reload_f({
                    options: reload_action,
                });
            }
        }, 'aer_1020'),
);
