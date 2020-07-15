import { LaserSettings } from './laserSettings';
import { Network} from './network';

export class Settings {
    language = 'english';
    scalingFactor = 1;
    stepsize = 5;
    laserSettings: LaserSettings;
    wifiSettings: WifiSettings;
    laserInHq = false;
    technicalMode = false;
    usedLaserSpace = 48110;
}
export interface WifiSettings {
  availableSSIDs: string [];
  savedWifis: Network[];
  MAC_Address: string;
}
