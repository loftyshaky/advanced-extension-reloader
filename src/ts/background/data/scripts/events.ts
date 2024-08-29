import { s_data as s_data_loftyshaky_sharded_clean } from '@loftyshaky/shared/shared_clean';
// import { s_data } from 'background/internal';

we.storage.sync.onChanged.addListener(
    (changes: any): Promise<void> =>
        err_async(async () => {
            await s_data_loftyshaky_sharded_clean.Sync.react_sync({
                changes,
                callback: async () => {
                    /*
                    await s_data.Manipulation.react_to_settings_change({
                        mode: 'set_from_storage',
                        update_context_menus: true,
                        load_settings: true,
                        force_set_actions: true,
                    });
*/
                },
            });
        }, 'cot_1135'),
);
