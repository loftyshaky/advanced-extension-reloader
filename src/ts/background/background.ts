import 'background/listen';
import '@loftyshaky/shared/ext';
import '@loftyshaky/shared/shared_clean';
import 'shared_clean/internal';
import { init } from 'background/internal';

importScripts('/env.js');
init();
