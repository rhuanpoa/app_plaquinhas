export type PlateStatus = "available" | "active" | "disabled";

export interface Plate {
  id: string;
  code: string;
  clientName: string | null;
  destinationUrl: string | null;
  status: PlateStatus;
  scans: number;
  createdAt: string;
  updatedAt: string;
}

/** Campos que podem ser alterados. O código da placa é permanente. */
export type PlateUpdate = Partial<Pick<Plate, "clientName" | "destinationUrl" | "status">>;

export type PlateFormMode = "configure" | "edit";

export interface PlateFormValues {
  clientName: string;
  destinationUrl: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type StatusFilterValue = "all" | PlateStatus;

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type UserUpdate = Pick<User, "name" | "email">;

export interface Scan {
  id: string;
  plateId: string;
  createdAt: string;
  userAgent: string | null;
}

export interface DailyScans {
  date: string;
  count: number;
}

export interface DashboardStats {
  totalPlates: number;
  activePlates: number;
  availablePlates: number;
  disabledPlates: number;
  scansLast30Days: number;
}

export interface DashboardData {
  stats: DashboardStats;
  dailyScans: DailyScans[];
  recentPlates: Plate[];
}

export interface SystemSettings {
  systemName: string;
  qrDomain: string;
}
