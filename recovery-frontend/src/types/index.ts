export interface IStrategy {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  status?: string;
  base_recovery_hours?: number;
}

export interface IPaginatedStrategies {
  items: IStrategy[];
  total: number;
}

export interface ICrumb {
  label: string;
  path?: string;
  active?: boolean;
}
