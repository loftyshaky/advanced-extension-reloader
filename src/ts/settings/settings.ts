import '@loftyshaky/shared/ext';
import { init_shared } from '@loftyshaky/shared/shared';
import { init, d_data } from 'settings/internal';

(async () => {
    d_data.Ui.create_ui_objs();
    await show_unable_to_access_settings_error({});

    init_shared();
    await init();
})();
