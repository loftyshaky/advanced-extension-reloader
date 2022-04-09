import { s_reload } from 'background_tab/internal';

export const init = (): void =>
    err(() => {
        s_reload.Watch.i().play_sound({ mute: true, notification_type: 'reload' });
        ext.send_msg({ msg: 'react_to_change' });
    }, 'aer_1000');
