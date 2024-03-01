export default interface IWaypoint {
  id: number;
  ident: string;
  collocated: boolean;
  name: string;
  latitude: number;
  longitude: number;
  navaidID: number | INavaid; // Assuming this can be null based on the lack of a 'NOT NULL' constraint
}

export interface INavaid {
  id: number;
  ident: string;
  type: number; // Assuming type is a numeric code of some kind
  name: string;
  freq: number; // Assuming this is a frequency value, thus a number
  channel: string; // If channel represents a numeric value it could be `number | string`
  usage: string;
  latitude: number;
  longitude: number;
  elevation: number;
  slavedVar: number; // Assuming this is a numeric value, such as a magnetic variation
  magneticVariation: number | null; // Assuming it can be null
  range: number | null; // Assuming it can be null
}
