import { IMetadata } from "./Meta.interfae";
import { IClient } from "./User.interface";

export interface IPage {
  id: string;

  themeId: string;

  clientId: string;

  metaId: string;

  subdomain: string;

  public: boolean;

  meta: IMetadata;

  client: IClient;
}
