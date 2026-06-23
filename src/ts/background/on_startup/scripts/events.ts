import '@loftyshaky/shared/ext';
import '@loftyshaky/shared/shared_clean';
import 'shared_clean/internal';
import { init } from 'background/internal';

we.runtime.onStartup.addListener((): void =>
    err(() => {
        void init();
    }, 'aer_1104'),
);
