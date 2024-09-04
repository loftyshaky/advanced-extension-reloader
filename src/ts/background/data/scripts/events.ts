import { s_data as s_data_loftyshaky_sharded_clean } from '@loftyshaky/shared/shared_clean';
import { s_data } from 'background/internal';

we.storage.sync.onChanged.addListener(
    (changes: any): Promise<void> =>
        err_async(async () => {
            await s_data_loftyshaky_sharded_clean.Sync.react_sync({
                changes,
                callback: async () => {
                    await s_data.Manipulation.react_to_settings_change();
                },
            });
        }, 'cot_1135'),
);
