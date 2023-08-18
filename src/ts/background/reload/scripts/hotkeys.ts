import { i_options } from 'shared/internal';
import { s_reload } from 'background/internal';

we.commands.onCommand.addListener(
    async (command: string): Promise<void> =>
        err_async(async () => {
            if (command === 'suspend_or_resume_automatic_reload') {
                s_reload.Watch.i().suspend_or_resume_automatic_reload();
            } else {
                const settings = await ext.storage_get(['click_action', 'context_menu_actions']);
                let reload_action: i_options.Options = settings.click_action;

                if (command !== 'reload_main') {
                    const reload_action_i: number = +command.replace(/\D/g, '') - 1;

                    reload_action = settings.context_menu_actions[reload_action_i];
                }

                if (n(reload_action)) {
                    s_reload.Watch.i().try_to_reload({
                        options: reload_action,
                    });
                }
            }
        }, 'aer_1020'),
);
