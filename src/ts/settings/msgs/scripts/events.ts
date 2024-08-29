import { t, d_data } from '@loftyshaky/shared/shared';
import { d_sections } from 'settings/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (msg_str === 'load_settings') {
            return d_data.Settings.set_from_storage()
                .then(() => {
                    if (n(msg.restore_back_up) && msg.restore_back_up) {
                        d_sections.Restore.restore_back_up_react();
                    }

                    return true;
                })
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'aer_1106'));
        }

        return false;
    }, 'aer_1126'),
);
