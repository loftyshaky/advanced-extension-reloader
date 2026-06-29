import type { Management } from 'webextension-polyfill';

import io from 'socket.io-client';

import type { i_error, t } from '@loftyshaky/shared/shared_clean';
import type { i_options } from 'shared_clean/internal';
import { s_reload } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}
    private clients: t.AnyRecord[] = [];

    public connect = async ({
        ports,
        reload_notification_volume,
    }: {
        ports: string[];
        reload_notification_volume: number;
    }): Promise<void> =>
        err_async(async () => {
            this.clients.forEach((client: t.AnyRecord): void => {
                client.close();
            });

            this.clients = [];

            ports.forEach((port: string): void =>
                err(() => {
                    const client = io(`http://localhost:${port}`, {
                        reconnectionDelayMax: 500,
                        randomizationFactor: 0,
                    });
                    /* for testing
                    const client = io(`http://localhost:${port}`, {
                        reconnectionDelay: 20000,
                        reconnectionDelayMax: 20000,
                        randomizationFactor: 0,
                    });
                    */

                    this.clients.push(client);

                    client.on('reload_app', async (options: i_options.Options): Promise<void> => {
                        if (env.browser === 'firefox') {
                            const { s_reload } = await import('background/internal');

                            void s_reload.Watch.try_to_reload({
                                options: options,
                                automatic_reload: true,
                            });
                        } else {
                            void ext.send_msg({ msg: 'reload', options });
                        }
                    });

                    client.on(
                        'play_error_notification',
                        ({ extension_id }: { extension_id?: string } = {}): void => {
                            void this.play_notification({
                                notification_type: 'error',
                                reload_notification_volume,
                                extension_id,
                            });
                        },
                    );

                    client.on(
                        'play_manifest_error_notification',
                        ({ extension_id }: { extension_id?: string } = {}): void => {
                            void this.play_notification({
                                notification_type: 'manifest_error',
                                reload_notification_volume,
                                extension_id,
                            });
                        },
                    );
                }, 'aer_1002'),
            );
        }, 'aer_1003');

    public play_notification = ({
        reload_notification_volume,
        notification_type,
        extension_id,
        at_least_one_extension_reloaded = false,
    }: {
        reload_notification_volume: number;
        notification_type: 'reload' | 'error' | 'manifest_error';
        extension_id?: string;
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
                    void audio.play();
                }, 'aer_1113');

            if (notification_type === 'manifest_error') {
                play_notification_inner({ notification_type_inner: notification_type });
            } else {
                const reload_notification_type: 'reload_success' | 'reload_error' =
                    notification_type === 'reload' ? 'reload_success' : 'reload_error';
                const bundle_notification_type: 'bundle_success' | 'bundle_error' =
                    notification_type === 'reload' ? 'bundle_success' : 'bundle_error';
                const extension_is_eligible_for_reload: boolean =
                    await s_reload.Watch.get_extension_reload_eligibility({ extension_id });

                const reloading_one_exts: boolean = n(extension_id);
                const extension_id_final: string =
                    typeof extension_id === 'string' ? extension_id : '';
                let this_ext: Management.ExtensionInfo | undefined;

                if (env.browser === 'firefox') {
                    try {
                        this_ext = await we.management.get(extension_id_final);
                    } catch (error_obj: unknown) {
                        if (n(error_obj)) {
                            show_err_ribbon(error_obj as i_error.ErrorObj, 'aer_1163', {
                                silent: true,
                            });
                        }
                    }
                } else {
                    this_ext = (await ext.send_msg_resp({
                        msg: 'get_ext',
                        extension_id: extension_id_final,
                    })) as Management.ExtensionInfo;
                }
                const extension_is_enabled: boolean = n(this_ext) && this_ext.enabled;
                const ext_is_installed: boolean = n(this_ext);
                const is_advanced_extension_reloader_id: boolean = n(extension_id)
                    ? s_reload.Watch.allowed_advanced_extension_reloader_ids.includes(extension_id)
                    : false;

                if (
                    extension_is_eligible_for_reload &&
                    ((ext_is_installed && extension_is_enabled) ||
                        (notification_type === 'reload'
                            ? at_least_one_extension_reloaded
                            : !reloading_one_exts))
                ) {
                    play_notification_inner({
                        notification_type_inner: reload_notification_type,
                    });
                } else if (!is_advanced_extension_reloader_id) {
                    play_notification_inner({
                        notification_type_inner: bundle_notification_type,
                    });
                }
            }
        }, 'aer_1004');
}

export const Watch = Class.get_instance();
