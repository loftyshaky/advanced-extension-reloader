import { d_error, s_data as s_data_loftyshaky_shared_clean } from '@loftyshaky/shared/shared_clean';
import { s_badge, s_data, s_offscreen, s_reload } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        if (!n(data.settings.prefs)) {
            s_data.Settings.init_defaults();
            await s_data_loftyshaky_shared_clean.Cache.set_data();
            await s_data.Manipulation.on_init_set_from_storage();
        }

        d_error.Error.set_detect_infinite_loops_val();
        void s_badge.Badge.set_text_color();
        void s_badge.Badge.show_reload_paused();
        void s_reload.ContextMenu.create();
        await s_offscreen.Document.create();
    }, 'aer_1010');
