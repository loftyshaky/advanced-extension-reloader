import { s_css_vars } from '@loftyshaky/shared';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set = (): void =>
        err(() => {
            const roots = [document.documentElement];

            s_css_vars.Main.i().set_transition_vars({
                roots,
                transition_duration: data.settings.transition_duration,
            });
        }, 'aer_1065');
}
