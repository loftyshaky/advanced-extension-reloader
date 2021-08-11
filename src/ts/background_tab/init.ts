import { s_reload } from 'background_tab/internal';

export const init = (): void =>
    err(() => {
        s_reload.Watch.i().connect();
        s_reload.Watch.i().play_sound({ volume: 0 });
        ext.send_msg({ msg: 'react_to_change' });
    }, 'aer_1051');
