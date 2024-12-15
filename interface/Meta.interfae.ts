export interface IMetadata {
  id: string;
  title: string;
  shortName: string;
  description: string;
  faviconUrl: string | null;
  faviconId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
