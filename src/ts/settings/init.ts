import { InitAll } from 'shared/internal';
import { d_sections } from 'settings/internal';

export const init = (): void =>
    err(() => {
        InitAll.i().init();

        d_sections.Main.i().init_sections();

        InitAll.i().render_settings();
    }, 'aer_1046');
