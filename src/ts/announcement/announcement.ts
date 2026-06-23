import '@loftyshaky/shared/ext';
import { d_data } from '@loftyshaky/shared/shared';
import { init } from 'announcement/internal';

void (async () => {
    await d_data.Settings.set_from_storage();
    show_unable_to_access_settings_error();

    await init();
})();
