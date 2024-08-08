import { s_badge, s_data, s_offscreen, s_reload } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Data.init_defaults();
        await s_data.Data.set_from_storage({ transform: true });
        s_badge.Badge.set_badge_text_color();
        s_badge.Badge.show_reload_suspended_badge();
        s_reload.ContextMenu.create();
        await s_offscreen.Document.create();
    }, 'aer_1010');
