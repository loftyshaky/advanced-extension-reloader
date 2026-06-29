import 'offscreen/msgs/scripts';

import '@loftyshaky/shared/ext';

misplaced_dependency(env.browser === 'firefox' ? 'background' : 'offscreen');

export * from 'offscreen/init';

export * as s_reload from 'offscreen/reload/scripts';
