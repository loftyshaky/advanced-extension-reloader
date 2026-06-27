import type { Target } from 'vite-plugin-static-copy';

import path from 'node:path';

import { Reloader } from 'advanced-extension-reloader-watch-2/reloader';
import appRoot from 'app-root-path';
import chokidar from 'chokidar';
import {
    type LibraryOptions,
    type PluginOption,
    type UserConfig,
    defineConfig,
    loadEnv,
} from 'vite';

import { Dependencies as DependenciesShared } from '@loftyshaky/shared/build/ts/dependencies';
import { Locales } from '@loftyshaky/shared/build/ts/locales';
import { generate_shared_config } from '@loftyshaky/shared/build/ts/vite.config';
import { get_shared_dist_path, watch } from '@loftyshaky/shared/build/ts/watch';

import { Dependencies } from './build/ts/dependencies';
import { Manifest } from './build/ts/manifest';

const app_root = appRoot.path.replaceAll(path.sep, path.posix.sep);

const extension_id = 'hmhmmmajoblhmohkmfjeoamhdpodihlg';

const dependencies_shared = new DependenciesShared({ app_root });

const manifest = new Manifest();
const locales = new Locales({ app_root, exclude_shared_locales: ['de'] });
const dependencies = new Dependencies();

const config = defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const reloader = new Reloader({
        port: 7221,
    });

    reloader.watch();

    const dest_path: string = path.posix.join(app_root, 'dist');
    const paths = {
        ts: path.join(app_root, 'src', 'ts'),
        scss: path.join(app_root, 'src', 'scss'),
    };
    const copy_paths: Target[] = [
        {
            src: path.posix.join(app_root, 'src', 'audio'),
            dest: dest_path,
            rename: { stripBase: true },
        },
    ];

    const shared_config = generate_shared_config({
        mode,
        env,
        app_root,
        dest_path,
        copy_paths,
        callback_build_start: () => {},
        callback_close_bundle: ({ build_error }: { build_error: boolean }) => {
            manifest.generate({
                env,
            });
            void locales.merge();

            dependencies_shared.add_missing_dependesies({
                extension_specific_missing_dependencies: dependencies.missing_dependencies,
            });

            if (build_error) {
                reloader.play_error_notification({ extension_id });
            } else {
                reloader.reload({
                    extension_id,
                    play_notifications: true,
                });
            }
        },
    }) as UserConfig & { build: { lib: LibraryOptions } } & { plugins: PluginOption[] };

    shared_config.build.lib.entry = {
        ...(shared_config.build.lib.entry as Record<string, unknown>),
        background: path.join(paths.ts, 'background', 'background.ts'),
        offscreen: path.join(paths.ts, 'offscreen', 'offscreen.ts'),
        settings: path.join(paths.ts, 'settings', 'settings.ts'),
        settings_css: path.join(paths.scss, 'settings', 'index.scss'),
    };

    shared_config.plugins = [
        ...shared_config.plugins,
        watch({
            paths_to_watch: [
                get_shared_dist_path({ app_root, env }),
                path.join(app_root, 'build', 'ts'),
                path.join(app_root, 'src', '_locales'),
                path.join(app_root, 'src', 'audio'),
                path.join(app_root, 'src', 'html'),
                path.join(app_root, 'src', 'icons'),
                path.join(app_root, 'src', 'scss'),
            ],
            reload_trigger_file: path.join(paths.ts, 'background', 'background.ts'),
            chokidar,
        }),
    ];

    return shared_config;
});

export default config;
