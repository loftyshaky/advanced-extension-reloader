import { t } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'rerun_actions') {
                await d_settings.Transform.i().set_transformed_from_storage();
            } else {
                await x.delay(10000);
            }

            return false;
        }, 'ges_1126'),
);
