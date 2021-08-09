import _ from 'lodash';
import { i_options } from 'shared/internal';

export class ContextMenu {
    private static i0: ContextMenu;

    public static i(): ContextMenu {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public generate_context_menu_item_text = ({
        app_name,
        context_menu_actions,
    }: {
        app_name: string;
        context_menu_actions: i_options.Options;
    }): string =>
        err(
            () =>
                _.capitalize(
                    `${app_name}${
                        context_menu_actions.hard
                            ? ext.msg('hard_context_menu_item')
                            : ext.msg('soft_context_menu_item')
                    } + ${
                        context_menu_actions.all_tabs
                            ? ext.msg('all_tabs_context_menu_item')
                            : ext.msg('one_tab_context_menu_item')
                    }`,
                ),
            'aer_1020',
        );
}
