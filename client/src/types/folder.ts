export interface Folder {
  _id: string;
  name: string;
  user:
    | string
    | {
        _id: string;
        email: string;
      };
  createdAt: string;
  updatedAt?: string;
}
