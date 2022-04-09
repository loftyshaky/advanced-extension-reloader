const path = require('path');

const appRoot = require('app-root-path').path;
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { Env } = require('@loftyshaky/shared/js/ext/env');
const { Locales } = require('@loftyshaky/shared/js/ext/locales');
const { shared_config } = require('@loftyshaky/shared/js/ext/webpack.config');
const { TaskScheduler } = require('@loftyshaky/shared/js/task_scheduler');
const { Manifest } = require('./js/manifest');

const task_scheduler = new TaskScheduler();

const app_root = appRoot;

const manifest = new Manifest({ app_root });
const env_instance = new Env({ app_root });
const locales = new Locales({ app_root });

module.exports = (env, argv) => {
    const paths = {
        ts: path.join(app_root, 'src', 'ts'),
    };

    const config = shared_config({
        app_root,
        webpack,
        argv,
        env,
        MiniCssExtractPlugin,
        CssMinimizerPlugin,
        CopyWebpackPlugin,
        copy_patters: [
            {
                from: path.join('src', 'audio'),
            },
        ],
        callback_begin: () => {
            task_scheduler.unlock_dist({
                package_name: 'Advanced Extension Reloader',
                remove_dist: argv.mode === 'production',
            });
        },
        callback_done: () => {
            manifest.generate({
                mode: argv.mode,
                test: env.test,
                browser: env.browser,
            });
            env_instance.generate({ browser: env.browser });
            locales.merge();
        },
    });

    config.resolve.alias = {
        ...config.resolve.alias,
        ...{
            background_tab: path.join(paths.ts, 'background_tab'),
        },
    };

    config.entry = {
        ...config.entry,
        ...{
            background: path.join(paths.ts, 'background', 'background.ts'),
            background_tab: path.join(paths.ts, 'background_tab', 'background_tab.ts'),
            background_tab_css: path.join(app_root, 'src', 'scss', 'background_tab', 'index.scss'),
            settings: path.join(paths.ts, 'settings', 'settings.ts'),
            settings_css: path.join(app_root, 'src', 'scss', 'settings', 'index.scss'),
        },
    };

    return config;
};
