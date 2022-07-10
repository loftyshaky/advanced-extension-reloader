import { InitAll } from 'shared/internal';
import { d_sections } from 'settings/internal';

export const init = (): void =>
    err(() => {
        d_sections.Main.i().init_sections();

        InitAll.i().render_settings();
    }, 'aer_1046');
