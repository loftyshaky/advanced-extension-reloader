import _ from 'lodash';

import { s_reload } from 'background/internal';

we.action.setBadgeBackgroundColor({ color: '#785FD9' }); // '#8b6fff'

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public ok_badge_text: string = '';
    public time_badge_text: string = '';
    private timer_badge_time_left: number = 0;
    private timer_badge_interval: number = 0;

    public show_ok_badge = (): Promise<void> =>
        err_async(async () => {
            this.hide_timer_badge();

            this.ok_badge_text = '✓';

            this.set_badge_text();

            this.show_timer_badge({
                time:
                    s_reload.Watch.i().reload_cooldown_timer_start_timestamp === 0
                        ? s_reload.Watch.i().last_cooldown_time
                        : s_reload.Watch.i().last_cooldown_time -
                          (Date.now() - s_reload.Watch.i().reload_cooldown_timer_start_timestamp),
            });

            this.hide_debounce();
        }, 'aer_1005');

    public hide_ok_badge = (): void =>
        err(() => {
            this.ok_badge_text = '';

            this.set_badge_text();
        }, 'aer_1006');

    private hide_debounce = _.debounce(this.hide_ok_badge, 2000);

    public show_timer_badge = ({ time }: { time: number }): Promise<void> =>
        err_async(async () => {
            this.timer_badge_time_left = time;

            const set_badge_time = (): void =>
                err(() => {
                    const seconds = (this.timer_badge_time_left / 1000.0).toFixed(1); // May be decimal

                    this.time_badge_text = (
                        _.isInteger(seconds) ? `${seconds}.0` : seconds
                    ).toString();

                    this.set_badge_text();
                }, 'aer_1097');

            set_badge_time();

            const step = 100;

            self.clearInterval(this.timer_badge_interval);

            this.timer_badge_interval = self.setInterval(async () => {
                err_async(async () => {
                    set_badge_time();

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

            self.clearInterval(this.timer_badge_interval);

            this.time_badge_text = '';

            this.set_badge_text();
        }, 'aer_1006');

    private set_badge_text = (): void =>
        err(() => {
            we.action.setBadgeText({ text: this.ok_badge_text + this.time_badge_text });
        }, 'aer_1096');
}
