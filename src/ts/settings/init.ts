import { d_sections } from 'settings/internal';
import { InitAll } from 'shared/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        await InitAll.init();

        d_sections.Sections.init();

        void InitAll.render_settings();
    }, 'aer_1046');
