import { s_reload } from 'background/internal';

we.action.onClicked.addListener(
    (): Promise<void> =>
        err_async(async () => {
            const click_action = await ext.storage_get('click_action');

            s_reload.Watch.i().try_to_reload({
                options: click_action.click_action,
            });
        }, 'aer_1013'),
);
