import _ from 'lodash';

import { t } from '@loftyshaky/shared';
import { i_data } from 'shared/internal';

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
                current_section: 'reload',
                options_page_theme: 'light',
                transition_duration: 200,
                show_color_help: true,
                enable_cut_features: false,
                ports: ['7220'],
                reload_notification_volume: '1',
                open_background_tab_automatically: true,
                open_position_in_tab_strip: 0,
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
        }, 'aer_1007');

    public update_settings = ({ settings }: { settings?: i_data.Settings } = {}): Promise<void> =>
        err_async(async () => {
            const settings_final: i_data.Settings = n(settings)
                ? settings
                : (this.defaults as i_data.Settings);

            await ext.storage_set(settings_final);
        }, 'aer_1008');

    public set_from_storage = (): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (_.isEmpty(settings)) {
                await this.update_settings();
            }
        }, 'aer_1009');
}
