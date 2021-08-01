import _ from 'lodash';

import { browser } from 'webextension-polyfill-ts';

export class Badge {
    private static i0: Badge;

    public static get i() {
        if (!this.i0) {
            this.i0 = new this();
        }

        return this.i0;
    }

    public show = (): Promise<void> =>
        err_async(async () => {
            await browser.browserAction.setBadgeText({ text: 'OK' });
            await browser.browserAction.setBadgeBackgroundColor({ color: '#8b6fff' });

            this.hide_debounce();
        }, 1034);

    public hide = (): Promise<void> =>
        err_async(async () => {
            await browser.browserAction.setBadgeText({ text: '' });
        }, 1035);

    private hide_debounce = _.debounce(this.hide, 2000);
}
