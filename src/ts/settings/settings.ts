import '@loftyshaky/shared/ext';
import { init_shared } from '@loftyshaky/shared/shared';
import { d_settings } from 'shared/internal';
import { init, d_data } from 'settings/internal';

(async () => {
    d_data.Ui.create_ui_objs();
    await d_settings.Transform.set_transformed_from_storage();
    await show_unable_to_access_settings_error();

    init_shared();
    await init();
})();
