import _ from 'lodash';
import { Tabs, Management } from 'webextension-polyfill-ts';

import { t } from '@loftyshaky/shared';
import { s_suffix, i_data, i_options } from 'shared/internal';
import { s_badge, s_reload, i_reload } from 'background/internal';

export class Watch {
    private static i0: Watch;

    public static i(): Watch {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private full_reload_timeout: number = 0;
    public generate_reload_debounce_f = (): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            this.full_reload_timeout = settings.full_reload_timeout;

            this.reload_debounce = _.debounce(this.reload, this.full_reload_timeout);
        }, 'aer_1089');

    public reload_debounce: t.CallbackVariadicVoid = () => undefined;

    public reload = (options: i_options.Options): Promise<void> =>
        err_async(async () => {
            const options_final: i_options.Options =
                s_reload.DefaultValues.i().tranform_reload_action({
                    reload_action: options,
                });

            if (options_final.hard) {
                const ext_id_option_specified = typeof options_final.ext_id === 'string';
                const exts: Management.ExtensionInfo[] = await we.management.getAll();
                const ext_tabs: Tabs.Tab[] = await s_reload.Tabs.i().get_ext_tabs();
                let tab_url_is_null: boolean = false;

                const ext_tabs_final: i_reload.TabWithExtId[] = ext_tabs.map(
                    (ext_tab: t.AnyRecord): i_reload.TabWithExtId =>
                        err(() => {
                            if (_.isNull(ext_tab.url)) {
                                tab_url_is_null = true;
                            } else {
                                const reg_exp = new RegExp(
                                    `^${s_reload.Tabs.i().ext_protocol}([\\s\\S]*?)/`,
                                );

                                const match = ext_tab.url.match(reg_exp);

                                if (_.isNull(match)) {
                                    tab_url_is_null = true;
                                } else {
                                    ext_tab.ext_id = match.pop();
                                }
                            }

                            return ext_tab as i_reload.TabWithExtId;
                        }, 'aer_1081'),
                );

                if (!tab_url_is_null) {
                    await Promise.all(
                        exts.map(async (ext: Management.ExtensionInfo) =>
                            err_async(async () => {
                                const matched_ext_id_from_options = ext.id === options_final.ext_id;

                                if (
                                    ext.id !== we.runtime.id &&
                                    ext.enabled &&
                                    ext.installType === 'development' &&
                                    (!ext_id_option_specified || matched_ext_id_from_options)
                                ) {
                                    await this.re_enable({
                                        ext,
                                        ext_tabs: ext_tabs_final,
                                    });
                                }
                            }, 'aer_1082'),
                        ),
                    );
                }
            }

            await s_reload.Tabs.i().reload_tabs({ all_tabs: options_final.all_tabs });
            await s_badge.Main.i().show();

            if (options_final.play_sound) {
                ext.send_msg({ msg: 'play_sound' });
            }
        }, 'aer_1005');

    private re_enable = ({
        ext,
        ext_tabs,
    }: {
        ext: Management.ExtensionInfo;
        ext_tabs: i_reload.TabWithExtId[];
    }): Promise<void> =>
        err_async(async () => {
            let reload_triggered = false;

            ((env.browser === 'firefox' ? browser : chrome) as any).runtime.sendMessage(
                ext.id,
                {
                    msg: new s_suffix.Main('reload_extension').result,
                },
                (response: any) => {
                    if (we.runtime.lastError) {
                        // eslint-disable-next-line no-console
                        console.error(we.runtime.lastError.message);
                    }

                    if (response === new s_suffix.Main('reload_triggered').result) {
                        reload_triggered = true;
                    }
                },
            );

            await x.delay(this.full_reload_timeout);

            if (!reload_triggered) {
                await we.management.setEnabled(ext.id, false);
                await we.management.setEnabled(ext.id, true);
            }

            await s_reload.Tabs.i().recreate_tabs({ ext, ext_tabs });
        }, 'aer_1079');
}
