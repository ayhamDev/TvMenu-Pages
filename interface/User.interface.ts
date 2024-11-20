export interface IAdmin {
  id: string;
  email: string;
  password: string;
  Role: "Admin";
}

export interface IClient {
  id: string;
  email: string;
  password: string;
  storeName: string;
  country: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  Role: "Client";
}

export type IUser = IAdmin | IClient;
