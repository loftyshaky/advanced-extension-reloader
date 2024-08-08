import { s_css_vars } from '@loftyshaky/shared/shared_clean';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set = (): void =>
        err(() => {
            const roots = [document.documentElement];

            s_css_vars.CssVars.set_transition_vars({
                roots,
                transition_duration: data.settings.transition_duration,
            });
        }, 'aer_1065');
}

export const CssVars = Class.get_instance();
