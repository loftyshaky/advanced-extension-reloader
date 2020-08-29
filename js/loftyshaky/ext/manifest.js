import _ from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import { magentaBright } from 'colorette';

export class Manifest {
    generate = ({ manifest }) => {
        const shared_manifest = {
            manifest_version: 2,
            version: process.env.npm_package_version,
            default_locale: 'en',
            icons: {
                16: 'icon16.png',
                48: 'icon48.png',
            },
            browser_action: {
                default_icon: {
                    16: 'icon16.png',
                    32: 'icon32.png',
                    64: 'icon64.png',
                },
            },
        };

        if (
            [
                'chrome',
                'opera',
                'edge',
            ].includes(process.env.browser)
        ) {
            shared_manifest.icons[128] = 'icon128.png';
        }

        if (process.env.browser === 'firefox') {
            shared_manifest.icons[96] = 'icon96.png';
        }

        if (process.env.browser === 'firefox' || process.env.build === 'dev') {
            shared_manifest.applications = {
                gecko: {
                    id: `${process.env.npm_package_name}@loftyshaky`,
                },
            };
        }

        fs.outputFileSync(
            path.join(
                __dirname,
                'build',
                'manifest.json',
            ),
            JSON.stringify(_.merge(
                {},
                shared_manifest,
                manifest,
            )),
            'utf-8',
        );

        // eslint-disable-next-line no-console
        console.log(magentaBright('Generated manifest.json'));
    }
}
