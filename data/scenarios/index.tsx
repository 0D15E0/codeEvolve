import { bankingScenario } from './banking';
import { filesystemScenario } from './filesystem';
import { libraryScenario } from './library';
import { Scenario } from '@/types';

// Combine all scenarios into a single list
export const SCENARIOS: Scenario[] = [
  bankingScenario,
  filesystemScenario,
  libraryScenario
];