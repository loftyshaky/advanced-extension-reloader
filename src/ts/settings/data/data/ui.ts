import { makeObservable, action } from 'mobx';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            create_ui_objs: action,
        });
    }

    public create_ui_objs = (): void =>
        err(() => {
            data.ui = {};
        }, 'cnt_1318');
}

export const Ui = Class.get_instance();
