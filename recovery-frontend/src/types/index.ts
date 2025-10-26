export interface IStrategy {
  id: number;  // или ID если в Go так
  title: string;  // или Title
  description: string;  // или Description
  image_url?: string;  // Попробуйте ImageURL
  status?: string;  // или Status
  base_recovery_hours?: number;  // Попробуйте BaseRecoveryHours
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
