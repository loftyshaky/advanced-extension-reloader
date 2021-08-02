import { s_badge, s_data } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Main.i().init_defaults();
        await s_data.Main.i().set_from_storage();
        s_badge.Main.i().hide();
    }, 'aer_1016');
