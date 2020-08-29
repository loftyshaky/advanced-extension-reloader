import path from 'path';
import recursiveReaddir from 'recursive-readdir';
import _ from 'lodash';

const generate_watch_files = async () => {
    let watch_files = [];

    const src_dir = path.join(
        __dirname,
        'src',
    );

    const dirs = [
        path.join(
            __dirname,
            'js',
        ),
        path.join(
            src_dir,
            '_locales',
        ),
        path.join(
            src_dir,
            'scss',
        ),
    ];

    await Promise.all(dirs.map(async (dir) => {
        const files = await recursiveReaddir(dir);

        watch_files = _.union(
            watch_files,
            files,
        );
    }));

    return watch_files;
};

export default function watcher() {
    return {
        async buildStart() {
            const watch_files = await generate_watch_files();

            watch_files.forEach((file) => {
                this.addWatchFile(file);
            });
        },
    };
}
