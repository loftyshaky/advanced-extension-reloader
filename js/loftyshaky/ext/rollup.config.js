/* eslint-disable import/no-unresolved */
import replace from '@rollup/plugin-replace';
import typescript2 from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import svgr from '@svgr/rollup';
import resolve from '@rollup/plugin-node-resolve';
import transformPaths from 'ts-transform-paths';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import watcher from './plugins/watcher';
import copy from '../shared/plugins/rollup-plugin-copy';

export const shared_config = ({ callback_end }) => (
    {
        input: ['watch.js'],
        output: [{
            dir: 'build',
            entryFileNames: '[name].js',
            chunkFileNames: 'chunk-[name]-[hash].js',
            format: 'es',
            sourcemap: process.env.build === 'dev'
                ? 'inline'
                : false,
        }],
        treeshake: process.env.build === 'prod',
        preserveEntrySignatures: false,
        watch: {
            clearScreen: false,
        },
        onwarn(warning, warn) {
            if (warning.code !== 'CIRCULAR_DEPENDENCY') {
                warn(warning);
            }
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify(
                    process.env.build === 'dev'
                        ? 'development'
                        : 'production',
                ),
                delimiters: [
                    '',
                    '',
                ],
            }),
            typescript2({
                rollupCommonJSResolveHack: true,
                clean: true,
                transformers: [transformPaths],
            }),
            commonjs(),
            json({
                compact: true,
            }),
            svgr(),
            resolve({
                browser: true,
            }),
            peerDepsExternal(),
            nodePolyfills(),
            del({
                targets: 'build',
            }),
            copy({
                targets: [{
                    src: [
                        'src/html/*',
                        'src/icons/all/*',
                        `src/icons/${process.env.browser}/*`,
                        'src/_locales',
                    ],
                    dest: 'build',
                }],
                hook: 'writeBundle',
                callback_end,
            }),
            watcher(),
            process.env.build === 'prod'
                ? terser({
                    output: {
                        comments(node, comment) {
                            const text = comment.value;
                            const { type } = comment;
                            if (type === 'comment2') {
                                return /@preserve|@license|@cc_on/i.test(text);
                            }

                            return undefined;
                        },
                    },
                    mangle: false,
                })
                : undefined,
        ],
    }
);
