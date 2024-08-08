import { init_shared } from '@loftyshaky/shared/shared';
import { d_settings } from 'shared/internal';
import { init } from 'settings/internal';

(async () => {
    await d_settings.Transform.set_transformed_from_storage();
    await show_unable_to_access_settings_error({});

    init_shared();
    await init();
})();
