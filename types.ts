export type ComponentType = 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'storage' | 'psu' | 'os';

export interface PCParts {
  cpu: string;
  gpu: string;
  ram: string;
  motherboard: string;
  storage: string;
  psu: string;
  os: string;
}

export interface TutorialStep {
  step: number;
  title: string;
  details: string;
}

export interface TutorialResponse {
  warnings: string[];
  tutorial: TutorialStep[];
}