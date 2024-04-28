export interface IUpdateProviderProfile {
  _id: string;
  type: string;
  professionId: string;
  businessName: string;
  city: string;
  serviceDescription: string;
  yearsOfExperience: string;
  idNumber: string;
  idPicture: string;
  whatsapp: string;
  officeNumber?: string;
}

export interface IListProviders {
  professionId: string;
  limit: number;
  offset: number;
}

export interface IProviderAvailability {
  userId: string;
  unAvailable: boolean;
  unAvailableStartDate?: string;
  unAvailableEndDate?: string;
  isLocationLimited: boolean;
  limitedCities?: string[];
}
