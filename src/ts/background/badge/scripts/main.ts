import _ from 'lodash';

import { browser } from 'webextension-polyfill-ts';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public show = (): Promise<void> =>
        err_async(async () => {
            await browser.action.setBadgeText({ text: 'OK' });
            await browser.action.setBadgeBackgroundColor({ color: '#8b6fff' });

            this.hide_debounce();
        }, 'aer_1034');

    public hide = (): Promise<void> =>
        err_async(async () => {
            await browser.action.setBadgeText({ text: '' });
        }, 'aer_1035');

    private hide_debounce = _.debounce(this.hide, 2000);
}
