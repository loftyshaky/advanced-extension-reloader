import type { Storage } from 'webextension-polyfill';

import { s_data as s_data_loftyshaky_sharded_clean } from '@loftyshaky/shared/shared_clean';
import { s_data } from 'background/internal';

we.storage.sync.onChanged.addListener(
    (changes: Storage.StorageAreaOnChangedChangesType): Promise<void> =>
        err_async(async () => {
            const is_internal_storage_write: unknown = await ext.send_msg_resp({
                msg: 'get_is_internal_storage_write_val',
            }); // Firefox fires onChanged when you update storage in code, unlike Chrome running it only when data syncs from server. This bool is to prevent double storage writes.

            if (!is_internal_storage_write) {
                await s_data_loftyshaky_sharded_clean.Sync.react_sync({
                    changes,
                    callback: async () => {
                        await s_data.Manipulation.react_to_settings_change();
                    },
                });
            }
        }, 'aer_1158'),
);
