import path from 'path';
import fs from 'fs-extra';
import { magentaBright } from 'colorette';
import sass from 'node-sass';

export class Styles {
    constructor({ scss_file_names }) {
        this.scss_file_names = scss_file_names;
        this.scss_files = scss_file_names.map((scss_file_name) => path.join(
            'src',
            'scss',
            scss_file_name,
            'index.scss',
        ));
    }

    build_dir = path.join(
        __dirname,
        'build',
    );

    css_dir = path.join(
        'src',
        'css',
    );

    css_file_names = [
        'error',
        'font_face',
        'normalize',
    ];

    css_files = [
        path.join(
            this.css_dir,
            `${this.css_file_names[0]}.css`,
        ),
        path.join(
            this.css_dir,
            `${this.css_file_names[1]}.css`,
        ),
        path.join(
            'node_modules',
            `${this.css_file_names[2]}.css`,
            `${this.css_file_names[2]}.css`,
        ),
    ];

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
