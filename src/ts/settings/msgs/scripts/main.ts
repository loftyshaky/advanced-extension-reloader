import { t } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (msg_str === 'upadate_settings_var') {
            d_settings.Transform.i().set_transformed_from_storage();
        }

        return undefined;
    }, 'aer_1126'),
);
