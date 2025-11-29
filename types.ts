export enum WorkerRole {
  GENERAL = "Разнорабочий",
  WELDER = "Сварщик",
  ELECTRICIAN = "Электрик",
  FOREMAN = "Прораб",
  ENGINEER = "Инженер",
  MASON = "Каменщик",
  PAINTER = "Маляр",
  DRIVER = "Водитель",
  MECHANIC = "Механик",
  SURVEYOR = "Геодезист",
  OTHER = "Другое"
}

export enum WorkStatus {
  ACTIVE = "На смене",
  SICK = "Больничный",
  LEAVE = "Отпуск",
  ABSENT = "Отсутствует"
}

export type WorkerCategory = 'ITR' | 'WORKER' | 'MACHINERY';

export interface WorkerData {
  id: string;
  name: string; // Or ID if anonymous
  role: string;
  category: WorkerCategory;
  location: string; // e.g., "Sector A", "Building 1"
  status: string;
  efficiency?: number; // 0-100 placeholder
}

export interface DashboardData {
  workers: WorkerData[];
  summary: string;
  alerts: string[];
  recommendations: string[];
}