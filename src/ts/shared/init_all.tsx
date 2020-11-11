import React from 'react';
import { render } from 'react-dom';

import {
    CrashHandler,
    Error,
} from '@loftyshaky/shared';
import { Suffix } from 'shared/internal';
import {
    u_settings,
} from '@loftyshaky/shared/settings';

export class InitAll {
    private static i0: InitAll;

    public static get i() {
        if (!this.i0) { this.i0 = new this(); }

        return this.i0;
    }

    public init = (): void => err(() => {
        this.set_page_title();

        const error_root: ShadowRoot = this.create_root({ prefix: 'error' }) as ShadowRoot;
        const settings_root: HTMLDivElement = this.create_root({
            prefix: 'settings',
            shadow_root: false,
        }) as HTMLDivElement;

        const render_settings = (): Promise<void> => err_async(async () => {
            const { Body } = await import('settings/components/Body');

            render(
                <CrashHandler><Body /></CrashHandler>,
                settings_root,
                (): void => {
                    x.css(
                        'normalize',
                        document.head,
                    );

                    const settings_css = x.css(
                        'settings',
                        document.head,
                    );

                    if (settings_css) {
                        settings_css.addEventListener('load',
                            async (): Promise<void> => {
                                const { d_sections } = await import('settings/internal');

                                u_settings.InputsWidth.i.calculate_for_all_sections(
                                    { sections: d_sections.Main.i.sections },
                                );
                                u_settings.InputsWidth.i.set_max_width();
                            });
                    }
                },
            );
        },

        1004);

        render(
            <Error app_id={new Suffix('').suffix} />,
            error_root,
            (): void => {
                render_settings();
            },
        );
    },
    1001);

    private create_root = (
        {
            prefix,
            shadow_root = true,
        }: {
            prefix: string;
            shadow_root?: boolean
        },
    ): HTMLDivElement | ShadowRoot | undefined => err(() => {
        const root = x.create(
            'div',
            x.cls([
                new Suffix('root').result,
                new Suffix(prefix).result,
            ]),
        );

        x.append(
            document.body,
            root,
        );

        if (shadow_root) {
            return root.attachShadow({ mode: 'open' });
        }

        return root;
    },
    1002);

    private set_page_title = (): void => err(() => {
        const title_el = s<HTMLTitleElement>('title');

        if (title_el) {
            title_el.textContent = ext.msg(`${page}_title_text`);
        }
    },
    1003);
}
