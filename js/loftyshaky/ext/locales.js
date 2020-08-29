import _ from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import { magentaBright } from 'colorette';

export class Locales {
    merge = async () => {
        const app_locales_path = path.join(
            __dirname,
            'src',
            '_locales',
        );
        const shared_locales_path = path.join(
            __dirname,
            'node_modules',
            '@loftyshaky',
            'shared',
            '_locales',
        );
        const locales = fs.readdirSync(app_locales_path);

        locales.forEach((locale) => {
            const app_messages = fs.readJSONSync(path.join(
                app_locales_path,
                locale,
                'messages.json',
            ));

            const shared_messages = fs.readJSONSync(path.join(
                shared_locales_path,
                locale,
                'messages.json',
            ));

            const merged_messages = _.merge(
                {},
                shared_messages,
                app_messages,
            );
            const dest_messages = path.join(
                __dirname,
                'build',
                '_locales',
                locale,
                'messages.json',
            );

            fs.writeJsonSync(
                dest_messages,
                merged_messages,
            );
        });

        // eslint-disable-next-line no-console
        console.log(magentaBright('Merged locales'));
    }
}
