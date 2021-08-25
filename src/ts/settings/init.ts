import { d_sections } from 'settings/internal';

export const init = (): void =>
    err(() => {
        d_sections.Main.i().init_sections();
    }, 'aer_1046');
