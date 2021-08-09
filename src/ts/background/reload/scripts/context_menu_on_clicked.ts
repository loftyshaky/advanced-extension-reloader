import { s_reload } from 'background/internal';

we.contextMenus.onClicked.addListener(
    (info): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get(['click_action', 'context_menu_actions']);

            s_reload.Watch.i().reload_debounce(settings.context_menu_actions[info.menuItemId]);
        }, 'aer_1055'),
);
