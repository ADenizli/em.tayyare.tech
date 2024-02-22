import FrequencyTypes from '../enums/FrequencyTypes';
import NavaidTypes from '../enums/NavaidTypes';

export default interface INavaid {
  ident: string;
  secondIdent: string;
  type: NavaidTypes;
  position: {
    latitude: number;
    longitude: number;
  };
  frequency: string;
  frequencyType: FrequencyTypes;
}
