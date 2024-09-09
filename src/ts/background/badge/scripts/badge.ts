import isInteger from 'lodash/isInteger';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    private prefixes: { reloading_tabs: '\u2B6E '; ok: '\u2713 ' } = {
        reloading_tabs: '\u2B6E ',
        ok: '\u2713 ',
    };

    private symbol_prefix: string = '';
    private on_off_text: string = '';
    public time_badge_text: string = '';
    private timer_badge_time_left: number = 0;
    private timer_badge_interval: number = 0;

    public show_prefixed_timer = ({
        prefix_name,
        time,
    }: {
        prefix_name: 'reloading_tabs' | 'ok';
        time: number;
    }): Promise<void> =>
        err_async(async () => {
            await this.hide_timer();

            const prefix = this.prefixes[prefix_name];

            this.symbol_prefix = prefix;

            await this.set_text();

            await this.show_timer({
                time,
            });

            this.hide_prefix();
        }, 'aer_1005');

    private hide_prefix = (): Promise<void> =>
        err_async(async () => {
            this.symbol_prefix = '';

            await this.set_text();
        }, 'aer_1006');

    public show_reload_paused = (): Promise<void> =>
        err_async(async () => {
            this.on_off_text = data.settings.prefs.pause_automatic_reload ? 'off' : 'on';

            await this.set_text();
            await this.set_background_color();
        }, 'aer_1006');

    private show_timer = ({ time }: { time: number }): Promise<void> =>
        new Promise<void>((resolve, reject) => {
            err_async(async () => {
                this.timer_badge_time_left = time;

                const set_badge_time = (): Promise<void> =>
                    err_async(async () => {
                        const seconds = (this.timer_badge_time_left / 1000.0).toFixed(1); // May be decimal

                        this.time_badge_text = (
                            isInteger(seconds) ? `${seconds}.0` : seconds
                        ).toString();

                        await this.set_text();
                    }, 'aer_1097');

                await set_badge_time();

                const step = 100;

                globalThis.clearInterval(this.timer_badge_interval);

                this.timer_badge_interval = self.setInterval(async () => {
                    try {
                        await set_badge_time();

                        this.timer_badge_time_left -= step;

                        if (this.timer_badge_time_left <= 0) {
                            this.hide_timer();
                            globalThis.clearInterval(this.timer_badge_interval);
                            resolve(); // Resolve the promise when the timer ends
                        }
                    } catch (error) {
                        reject(error); // Reject the promise if an error occurs
                    }
                }, step);
            }, 'aer_1005');
        });

    private hide_timer = (): Promise<void> =>
        err_async(async () => {
            this.timer_badge_time_left = 0;

            globalThis.clearInterval(this.timer_badge_interval);

            this.time_badge_text = '';

            await this.show_reload_paused();
        }, 'aer_1006');

    private set_text = (): Promise<void> =>
        err_async(async () => {
            let prefix: string = '';

            if (this.symbol_prefix !== '') {
                prefix = this.symbol_prefix;
            } else if (this.time_badge_text === '') {
                prefix = this.on_off_text;
            }

            await we.action.setBadgeText({ text: prefix + this.time_badge_text });
        }, 'aer_1096');

    private set_background_color = (): Promise<void> =>
        err_async(async () => {
            const background_color: string = data.settings.prefs.pause_automatic_reload
                ? '#cc2b2b'
                : '#249c3e'; // off/on

            await we.action.setBadgeBackgroundColor({ color: background_color });
        }, 'aer_1102');

    public set_text_color = (): Promise<void> =>
        err_async(async () => {
            await we.action.setBadgeTextColor({ color: 'white' });
        }, 'aer_1103');
}

export const Badge = Class.get_instance();
