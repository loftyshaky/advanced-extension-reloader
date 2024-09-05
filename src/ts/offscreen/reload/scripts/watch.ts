import io from 'socket.io-client';

import { s_reload, i_options } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}
    private clients: any[] = [];

    public connect = async ({
        ports,
        reload_notification_volume,
    }: {
        ports: string[];
        reload_notification_volume: number;
    }): Promise<void> =>
        err_async(async () => {
            this.clients.forEach((client: any): void => {
                client.close();
            });

            this.clients = [];

            ports.forEach((port: string): void =>
                err(() => {
                    const client = io(`http://localhost:${port}`, {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        reconnectionDelayMax: 500,
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        randomizationFactor: 0,
                    });

                    this.clients.push(client);

                    client.on('reload_app', (options: i_options.Options): void => {
                        ext.send_msg({ msg: 'reload', options });
                    });

                    client.on(
                        'play_error_notification',
                        ({ ext_id }: { ext_id?: string } = {}): void => {
                            this.play_notification({
                                notification_type: 'error',
                                reload_notification_volume,
                                ext_id,
                            });
                        },
                    );

                    client.on(
                        'play_manifest_error_notification',
                        ({ ext_id }: { ext_id?: string } = {}): void => {
                            this.play_notification({
                                notification_type: 'manifest_error',
                                reload_notification_volume,
                                ext_id,
                            });
                        },
                    );
                }, 'aer_1002'),
            );
        }, 'aer_1003');

    public play_notification = ({
        reload_notification_volume,
        notification_type,
        ext_id,
        at_least_one_extension_reloaded = false,
    }: {
        reload_notification_volume: number;
        notification_type: 'reload' | 'error' | 'manifest_error';
        ext_id?: string;
        at_least_one_extension_reloaded?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            const play_notification_inner = ({
                notification_type_inner,
            }: {
                notification_type_inner:
                    | 'reload_success'
                    | 'bundle_success'
                    | 'reload_error'
                    | 'bundle_error'
                    | 'manifest_error';
            }): void =>
                err(() => {
                    const sound_filename = `${notification_type_inner}.wav`;
                    const audio = new Audio(sound_filename);

                    audio.volume = reload_notification_volume;
                    audio.play();
                }, 'aer_1113');

            if (notification_type === 'manifest_error') {
                play_notification_inner({ notification_type_inner: notification_type });
            } else {
                const reload_notification_type: 'reload_success' | 'reload_error' =
                    notification_type === 'reload' ? 'reload_success' : 'reload_error';
                const bundle_notification_type: 'bundle_success' | 'bundle_error' =
                    notification_type === 'reload' ? 'bundle_success' : 'bundle_error';
                const extension_is_eligible_for_reload: boolean =
                    await s_reload.Watch.extension_is_eligible_for_reload({ ext_id });

                const reloading_one_exts: boolean = n(ext_id);
                const ext_is_installed: boolean = await ext.send_msg_resp({
                    msg: 'check_if_ext_is_installed',
                    ext_id,
                });

                if (
                    extension_is_eligible_for_reload &&
                    (ext_is_installed ||
                        (notification_type === 'reload'
                            ? at_least_one_extension_reloaded
                            : !reloading_one_exts))
                ) {
                    play_notification_inner({
                        notification_type_inner: reload_notification_type,
                    });
                } else {
                    play_notification_inner({
                        notification_type_inner: bundle_notification_type,
                    });
                }
            }
        }, 'aer_1004');
}

export const Watch = Class.get_instance();
