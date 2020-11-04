import path from 'path';
import fs from 'fs-extra';
import { magentaBright } from 'colorette';
import sass from 'node-sass';

export class Styles {
    constructor({ scss_file_names }) {
        this.scss_file_names = [
            ...scss_file_names,
            ...this.css_for_build_dir_names,
            ...this.theme_names,
        ];
        this.scss_files = [
            ...scss_file_names.map((scss_file_name) => path.join(
                'src',
                'scss',
                scss_file_name,
                'index.scss',
            )),
            ...this.css_for_build_dir_names.map((css_for_build_dir_name) => path.join(
                this.shared_dir,
                `${css_for_build_dir_name}.scss`,
            )),
            ...this.theme_names.map((theme_name) => path.join(
                this.themes_dir,
                `${theme_name}.scss`,
            )),
        ];
    }

    css_for_build_dir_names = [
        'font_face',
        'error',
    ]

    theme_names = [
        'light_theme',
        'dark_theme',
        'very_dark_theme',
    ]

    shared_dir = path.join(
        'src',
        'scss',
        'loftyshaky',
        'shared',
    )

    themes_dir = path.join(
        this.shared_dir,
        'themes',
        'general',
    )

    build_dir = path.join(
        __dirname,
        'build',
    );

    css_dir = path.join(
        'src',
        'css',
    );

    css_file_names = ['normalize'];

    css_files = [path.join(
        'node_modules',
        `${this.css_file_names[0]}.css`,
        `${this.css_file_names[0]}.css`,
    )];

    async compile_and_copy() {
        this.scss_files.forEach((scss_file, i) => {
            const dest = path.join(
                this.build_dir,
                `${this.scss_file_names[i]}.css`,
            );
            const result = sass.renderSync({
                file: scss_file,
            });

            fs.outputFileSync(
                dest,
                result.css,
            );
        });

        this.css_files.forEach((css_file, i) => {
            const dest = path.join(
                this.build_dir,
                `${this.css_file_names[i]}.css`,
            );

            fs.copySync(
                css_file,
                dest,
            );
        });

        // eslint-disable-next-line no-console
        console.log(magentaBright('Compiled scss'));
    }
}
