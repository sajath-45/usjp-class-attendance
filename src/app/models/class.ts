export interface Trip {
  tripId: string;
  type: string;
  passengers: any[];
  inCarList?: any[];
  rider: string;
  startLocation: { lat: number; lng: number; name: string };
  endLocation: {
    lat: number;
    lng: number;
    name: string;
    destinationType?: number;
  };
  destinationType: number;
  startTime: any;
  startDate: string;
  distance: number;
  dateUTC: any;
  status: string;
  costPerPerson?;
}
