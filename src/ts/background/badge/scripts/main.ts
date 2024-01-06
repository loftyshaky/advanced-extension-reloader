import _ from 'lodash';

import { s_reload } from 'background/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public ok_badge_text: string = '';
    private reload_suspended_badge: string = '';
    public time_badge_text: string = '';
    private timer_badge_time_left: number = 0;
    private timer_badge_interval: number = 0;

    public show_ok_badge = (): Promise<void> =>
        err_async(async () => {
            this.hide_timer_badge();

            this.ok_badge_text = '\u2713';

            await this.set_badge_text();

            this.show_timer_badge({
                time:
                    s_reload.Watch.i().reload_cooldown_timer_start_timestamp === 0
                        ? s_reload.Watch.i().last_cooldown_time
                        : s_reload.Watch.i().last_cooldown_time -
                          (Date.now() - s_reload.Watch.i().reload_cooldown_timer_start_timestamp),
            });

            this.hide_debounce();
        }, 'aer_1005');

    public hide_ok_badge = (): Promise<void> =>
        err_async(async () => {
            this.ok_badge_text = '';

            await this.set_badge_text();
        }, 'aer_1006');

    public show_reload_suspended_badge = (): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get();

            this.reload_suspended_badge = settings.suspend_automatic_reload ? 'off' : 'on';

            await this.set_badge_text();
            await this.set_badge_background_color();
        }, 'aer_1006');

    private hide_debounce = _.debounce(this.hide_ok_badge, 2000);

    public show_timer_badge = ({ time }: { time: number }): Promise<void> =>
        err_async(async () => {
            this.timer_badge_time_left = time;

            const set_badge_time = (): Promise<void> =>
                err_async(async () => {
                    const seconds = (this.timer_badge_time_left / 1000.0).toFixed(1); // May be decimal

                    this.time_badge_text = (
                        _.isInteger(seconds) ? `${seconds}.0` : seconds
                    ).toString();

                    await this.set_badge_text();
                }, 'aer_1097');

            set_badge_time();

            const step = 100;

            globalThis.clearInterval(this.timer_badge_interval);

            this.timer_badge_interval = self.setInterval(async () => {
                err_async(async () => {
                    await set_badge_time();

                    this.timer_badge_time_left -= step;

                    if (this.timer_badge_time_left <= 0) {
                        this.hide_timer_badge();
                    }
                }, 'aer_1093');
            }, step);
        }, 'aer_1005');

    private hide_timer_badge = (): void =>
        err(() => {
            this.timer_badge_time_left = 0;

            globalThis.clearInterval(this.timer_badge_interval);

            this.time_badge_text = '';

            this.show_reload_suspended_badge();
        }, 'aer_1006');

    private set_badge_text = (): Promise<void> =>
        err_async(async () => {
            let prefix: string = '';

            if (this.ok_badge_text !== '') {
                prefix = this.ok_badge_text;
            } else if (this.time_badge_text === '') {
                prefix = this.reload_suspended_badge;
            }

            await we.action.setBadgeText({ text: prefix + this.time_badge_text });
        }, 'aer_1096');

    private set_badge_background_color = (): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get();
            const background_color: string = settings.suspend_automatic_reload
                ? '#cc2b2b'
                : '#249c3e'; // off/on

            await we.action.setBadgeBackgroundColor({ color: background_color });
        }, 'aer_1102');

    public set_badge_text_color = (): Promise<void> =>
        err_async(async () => {
            await we.action.setBadgeTextColor({ color: 'white' });
        }, 'aer_1103');
}
