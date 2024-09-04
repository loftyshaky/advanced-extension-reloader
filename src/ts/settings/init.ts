import { InitAll } from 'shared/internal';
import { d_inputs } from '@loftyshaky/shared/inputs';
import { d_sections } from 'settings/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        d_inputs.InputWidth.set_min_and_max_width({ min_width: 310 });

        await InitAll.init();

        d_sections.Sections.init();

        InitAll.render_settings();
    }, 'aer_1046');
