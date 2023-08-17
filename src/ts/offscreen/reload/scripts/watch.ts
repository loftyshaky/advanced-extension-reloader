import io from 'socket.io-client';

import { i_options } from 'shared/internal';

export class Watch {
    private static i0: Watch;

    public static i(): Watch {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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

                    client.on('play_error_notification', (): void => {
                        this.play_sound({
                            notification_type: 'error',
                            reload_notification_volume,
                        });
                    });
                }, 'aer_1002'),
            );
        }, 'aer_1003');

    public play_sound = ({
        reload_notification_volume,
        notification_type,
    }: {
        reload_notification_volume: number;
        notification_type: 'reload' | 'error';
    }): void =>
        err(() => {
            const sound_filename =
                notification_type === 'reload'
                    ? '330046__paulmorek__beep-03-positive.wav'
                    : '330068__paulmorek__beep-06-low-2015-06-22.wav';
            const audio = new Audio(sound_filename);
            audio.volume = reload_notification_volume;
            audio.play();
        }, 'aer_1004');
}
