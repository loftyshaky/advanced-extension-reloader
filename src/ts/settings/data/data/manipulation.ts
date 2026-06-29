import { s_data } from '@loftyshaky/shared/shared_clean';
import type { i_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public is_internal_storage_write: boolean = false;
    private is_internal_storage_write_timeout: number = 0;

    public send_msg_to_update_settings = ({
        settings,
        replace = false,
        update_instantly = false,
        transform = false,
        transform_force = false,
        load_settings = false,
        restore_back_up = false,
    }: {
        settings?: i_data.Settings;
        replace?: boolean;
        update_instantly?: boolean;
        transform?: boolean;
        transform_force?: boolean;
        load_settings?: boolean;
        restore_back_up?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            clearTimeout(this.is_internal_storage_write_timeout);

            this.is_internal_storage_write = true;

            await s_data.Cache.set({
                key: 'updating_settings',
                val: true,
            });

            await ext.send_msg_resp({
                msg: 'update_settings',
                settings: x.to_plain(settings),
                replace,
                update_instantly,
                transform,
                transform_force,
                load_settings,
                restore_back_up,
            });

            this.is_internal_storage_write_timeout = setTimeout(() => {
                this.is_internal_storage_write = false;
            }, 500);
        }, 'aer_1124');
}

export const Manipulation = Class.get_instance();
