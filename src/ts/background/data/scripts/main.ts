import _ from 'lodash';

import { t } from '@loftyshaky/shared';
import { i_data } from 'shared/internal';
import { s_reload } from 'background/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public defaults: i_data.Settings | t.EmptyRecord = {};

    public init_defaults = (): void =>
        err(() => {
            this.defaults = {
                current_section: 'settings',
                options_page_theme: 'light',
                transition_duration: 200,
                show_color_help: true,
                enable_cut_features: false,
                ports: ['7220'],
                full_reload_timeout: 300,
                click_action: {
                    all_tabs: false,
                    hard: true,
                },
                context_menu_actions: [
                    {
                        all_tabs: false,
                        hard: true,
                    },
                    {
                        all_tabs: true,
                        hard: true,
                    },
                    {
                        all_tabs: false,
                        hard: false,
                    },
                    {
                        all_tabs: true,
                        hard: false,
                    },
                ],
            };
        }, 'aer_1002');

    public update_settings = ({ settings }: { settings?: i_data.Settings } = {}): Promise<void> =>
        err_async(async () => {
            const settings_final: i_data.Settings = n(settings)
                ? settings
                : (this.defaults as i_data.Settings);

            await ext.storage_set(settings_final);

            s_reload.Watch.i().generate_reload_debounce_f();
        }, 'aer_1003');

    public set_from_storage = (): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (_.isEmpty(settings)) {
                this.update_settings();
            }
        }, 'aer_1004');
}
