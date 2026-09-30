export enum ListingType {
  Sale = 'sale',
  Rent = 'rent',
}

export interface Listing {
  _id: string;
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice?: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: ListingType;
  offer: boolean;
  imageUrls: string[];
  imagePublicIds: string[];
  userRef: string;
  createdAt?: string;
  updatedAt?: string;
}
