import React from 'react';
import ReactDOM from 'react-dom/client';

import '@loftyshaky/shared/ext';
import {
    c_crash_handler,
    c_error,
    c_loading_screen,
    d_loading_screen,
    s_tab_index,
    s_theme,
} from '@loftyshaky/shared';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { s_css_vars, d_settings, s_suffix } from 'shared/internal';

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare let __webpack_public_path__: string;

export class InitAll {
    private static i0: InitAll;

    public static i(): InitAll {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private settings_root: HTMLDivElement | undefined = undefined;
    private dependencies_root: HTMLDivElement | undefined = undefined;

    public init = (): Promise<void> =>
        new Promise((reslove) => {
            err_async(async () => {
                const on_loading_screen_render = (): void =>
                    err(() => {
                        const loading_screen_root_el = s<HTMLDivElement>(
                            `.${new s_suffix.Main('loading_screen').result}`,
                        );

                        if (n(loading_screen_root_el) && n(loading_screen_root_el.shadowRoot)) {
                            const loading_screen_css = x.css(
                                'loading_screen',
                                loading_screen_root_el.shadowRoot,
                            );

                            if (n(loading_screen_css)) {
                                x.bind(loading_screen_css, 'load', (): void =>
                                    err(() => {
                                        if (page === 'dependencies') {
                                            s_theme.Main.i().set({
                                                name: data.settings.options_page_theme,
                                            });
                                        }

                                        d_loading_screen.Main.i().show();

                                        reslove();
                                    }, 'aer_1072'),
                                );
                            }
                        }
                    }, 'aer_1073');

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                __webpack_public_path__ = we.runtime.getURL('');

                if (page === 'settings') {
                    await d_settings.Transform.i().set_transformed_from_storage();
                }

                this.set_page_title();

                s_css_vars.Main.i().set();

                const error_root: ShadowRoot = this.create_root({ prefix: 'error' }) as ShadowRoot;
                const loading_screen_root: ShadowRoot = this.create_root({
                    prefix: 'loading_screen',
                }) as ShadowRoot;

                if (page === 'settings') {
                    this.settings_root = this.create_root({
                        prefix: 'settings',
                        shadow_root: false,
                    }) as HTMLDivElement;
                } else if (page === 'dependencies') {
                    this.dependencies_root = this.create_root({
                        prefix: 'dependencies',
                        shadow_root: false,
                    }) as HTMLDivElement;
                }

                ReactDOM.createRoot(error_root).render(
                    <c_error.Body
                        app_id={s_suffix.app_id}
                        on_render={(): void =>
                            err(() => {
                                ReactDOM.createRoot(loading_screen_root).render(
                                    <c_crash_handler.Body>
                                        <c_loading_screen.Body
                                            app_id={s_suffix.app_id}
                                            on_render={(): void => {
                                                on_loading_screen_render();
                                            }}
                                        />
                                    </c_crash_handler.Body>,
                                );
                            }, 'aer_1073')
                        }
                    />,
                );
            }, 'aer_1074');
        });

    private create_root = ({
        prefix,
        shadow_root = true,
    }: {
        prefix: string;
        shadow_root?: boolean;
    }): HTMLDivElement | ShadowRoot | undefined =>
        err(() => {
            const root = x.create(
                'div',
                x.cls([new s_suffix.Main('root').result, new s_suffix.Main(prefix).result]),
            );

            x.append(document.body, root);

            if (shadow_root) {
                return root.attachShadow({ mode: 'open' });
            }

            return root;
        }, 'aer_1075');

    private set_page_title = (): void =>
        err(() => {
            const title_el = s<HTMLTitleElement>('title');

            if (n(title_el)) {
                title_el.textContent = ext.msg(`${page}_title_text`);
            }
        }, 'aer_1076');

    public render_settings = (): Promise<void> =>
        err_async(async () => {
            const { Body } = await import('settings/components/body');

            const on_css_load = (): Promise<void> =>
                err_async(async () => {
                    const { d_sections } = await import('settings/internal');

                    d_inputs.InputWidth.i().calculate_for_all_sections({
                        sections: d_sections.Main.i().sections as i_inputs.Sections,
                    });
                    d_inputs.InputWidth.i().set_max_width();

                    d_loading_screen.Main.i().hide({ app_id: s_suffix.app_id });

                    s_tab_index.Main.i().bind_set_input_type_f();
                }, 'aer_1066');

            if (n(this.settings_root)) {
                ReactDOM.createRoot(this.settings_root).render(
                    <c_crash_handler.Body>
                        <Body
                            on_render={(): void =>
                                err(() => {
                                    const settings_css = x.css('settings_css', document.head);

                                    s_theme.Main.i().set({
                                        name: data.settings.options_page_theme,
                                    });

                                    if (n(settings_css)) {
                                        x.bind(settings_css, 'load', on_css_load);
                                    }
                                }, 'aer_1067')
                            }
                        />
                    </c_crash_handler.Body>,
                );
            }
        }, 'aer_1068');

    public render_dependencies = (): Promise<void> =>
        err_async(async () => {
            const { Body } = await import('dependencies/components/body');

            const on_css_load = (): Promise<void> =>
                err_async(async () => {
                    d_loading_screen.Main.i().hide({ app_id: s_suffix.app_id });
                }, 'aer_1107');

            if (n(this.dependencies_root)) {
                ReactDOM.createRoot(this.dependencies_root).render(
                    <c_crash_handler.Body>
                        <Body
                            on_render={(): void =>
                                err(() => {
                                    const dependencies_css = x.css(
                                        'dependencies_css',
                                        document.head,
                                    );

                                    s_theme.Main.i().set({
                                        name: data.settings.options_page_theme,
                                        additional_theme_callback: s_theme.Main.i().set,
                                    });

                                    if (n(dependencies_css)) {
                                        x.bind(dependencies_css, 'load', on_css_load);
                                    }
                                }, 'aer_1109')
                            }
                        />
                    </c_crash_handler.Body>,
                );
            }
        }, 'aer_1108');
}
