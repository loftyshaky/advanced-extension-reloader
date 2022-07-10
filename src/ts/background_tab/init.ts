import { InitAll } from 'shared/internal';
import { s_reload } from 'background_tab/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        await InitAll.i().init();

        s_reload.Watch.i().play_sound({ mute: true, notification_type: 'reload' });
        ext.send_msg({ msg: 'react_to_change' });

        InitAll.i().render_background_tab();
    }, 'aer_1000');
