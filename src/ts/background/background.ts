import '@loftyshaky/shared';
import 'shared/internal';
import 'background/msgs';
import { s_settings, s_badge } from 'background/internal';

s_settings.Settings.i.set_from_storage();
s_badge.Badge.i.hide();
