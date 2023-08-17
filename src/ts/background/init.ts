import { s_badge, s_data, s_offscreen, s_reload } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Main.i().init_defaults();
        await s_data.Main.i().set_from_storage({ transform: true });
        s_badge.Main.i().hide_ok_badge();
        s_reload.ContextMenu.i().create();
        await s_offscreen.Main.i().create_document();
    }, 'aer_1010');
