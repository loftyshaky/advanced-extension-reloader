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

    public connect = (): Promise<void> =>
        err_async(async () => {
            this.clients.forEach((client: any): void => {
                client.close();
            });

            this.clients = [];

            data.settings.ports.forEach((port: number): void =>
                err(() => {
                    const client = io(`http://localhost:${port}`);
                    this.clients.push(client);

                    client.on('reload_app', (options: i_options.Options): void => {
                        ext.send_msg({ msg: 'reload', options });
                    });
                }, 'aer_1002'),
            );
        }, 'aer_1003');

    public play_sound = ({ mute = false }: { mute?: boolean } = {}): void =>
        err(() => {
            const audio = new Audio('330046__paulmorek__beep-03-positive.wav');
            audio.volume = mute ? 0 : data.settings.reload_notification_volume;
            audio.play();
        }, 'aer_1004');
}
