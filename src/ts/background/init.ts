import { s_badge, s_data, s_reload } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Main.i().init_defaults();
        await s_data.Main.i().set_from_storage();
        s_badge.Main.i().hide();
        s_reload.Watch.i().generate_reload_debounce_f();
    }, 'aer_1016');
