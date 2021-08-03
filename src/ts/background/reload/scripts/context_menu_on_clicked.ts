import { browser } from 'webextension-polyfill-ts';

import { i_options } from 'shared/internal';
import { s_reload } from 'background/internal';

browser.contextMenus.onClicked.addListener((info) => {
    const reload_action_arr: string[] = (info.menuItemId as string).split('-');

    const rekoad_actions: i_options.Options = {
        ext_id: reload_action_arr[0] === 'undefined' ? undefined : reload_action_arr[0],
        hard: x.convert_string_bool(reload_action_arr[1]),
        hardfull: x.convert_string_bool(reload_action_arr[2]),
        all_tabs: x.convert_string_bool(reload_action_arr[3]),
    };

    s_reload.Watch.i().reload(rekoad_actions);
});
