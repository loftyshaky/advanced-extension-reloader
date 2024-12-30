import { s_data as s_data_loftyshaky_shared_clean } from '@loftyshaky/shared/shared_clean';
import { s_badge, s_data, s_offscreen, s_reload } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Settings.init_defaults();
        await s_data_loftyshaky_shared_clean.Cache.set_data();
        await s_data.Manipulation.on_init_set_from_storage();
        s_reload.Tabs.set_extension_urls();
        s_badge.Badge.set_text_color();
        s_badge.Badge.show_reload_paused();
        s_reload.ContextMenu.create();
        await s_offscreen.Document.create();
    }, 'aer_1010');
