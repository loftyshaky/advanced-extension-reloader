import { Manifest } from './js/manifest';
import { Env } from './js/loftyshaky/ext/env';
import { Locales } from './js/loftyshaky/ext/locales';
import { Styles } from './js/loftyshaky/ext/styles';
import { shared_config } from './js/loftyshaky/ext/rollup.config';

const manifest = new Manifest();
const env = new Env();
const locales = new Locales();
const styles = new Styles({ scss_file_names: ['settings'] });

const config = shared_config({
    callback_end: () => {
        manifest.generate();
        env.generate();
        locales.merge();
        styles.compile_and_copy();
    },
});

config.input = [
    'src/ts/background/background.ts',
    'src/ts/settings/settings.ts',
];

export default config;
