import { t } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (msg_str === 'react_to_change') {
            return d_settings.Transform.i()
                .set_transformed_from_storage()
                .then((response) => response)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'aer_1106'));
        }

        return false;
    }, 'ges_1126'),
);
