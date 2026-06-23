import type { i_error, t } from '@loftyshaky/shared/shared_clean';
import { d_data, d_sections } from 'settings/internal';

we.runtime.onMessage.addListener(
    (msg: t.Any): t.Any =>
        err(() => {
            const msg_str: string = msg.msg;

            if (msg_str === 'load_settings') {
                return d_data.Settings.set_from_storage({
                    transform: n(msg.transform) ? msg.transform : false,
                })
                    .then(() => {
                        if (n(msg.restore_back_up) && msg.restore_back_up) {
                            void d_sections.Restore.restore_back_up_react();
                        }

                        return true;
                    })
                    .catch((error_obj: i_error.ErrorObj) => show_err_ribbon(error_obj, 'aer_1106'));
            }

            return false;
        }, 'aer_1126'),
);
