import '@loftyshaky/shared/ext';
import { init_shared } from '@loftyshaky/shared';
import 'shared/internal';
import { init } from 'background/internal';

we.runtime.onStartup.addListener((): void =>
    err(() => {
        importScripts('/env.js');

        init_shared();
        init();
    }, 'aer_1104'),
);
