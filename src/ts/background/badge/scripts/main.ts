import _ from 'lodash';

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
            await we.action.setBadgeText({ text: 'OK' });
            await we.action.setBadgeBackgroundColor({ color: '#8b6fff' });

            this.hide_debounce();
        }, 'aer_1005');

    public hide = (): Promise<void> =>
        err_async(async () => {
            await we.action.setBadgeText({ text: '' });
        }, 'aer_1006');

    private hide_debounce = _.debounce(this.hide, 2000);
}
