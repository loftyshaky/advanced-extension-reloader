import { s_side_effects } from 'background/internal';

we.management.onUninstalled.addListener(
    (): Promise<void> =>
        err_async(async () => {
            await s_side_effects.SideEffects.react_to_change();
        }, 'aer_1042'),
);

we.management.onInstalled.addListener(
    (): Promise<void> =>
        err_async(async () => {
            await s_side_effects.SideEffects.react_to_change();
        }, 'aer_1043'),
);
