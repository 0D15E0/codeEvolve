import { ReactNode } from "react";

export type Level = {
  id: number;
  title: string;
  description: string;
  starterCode: string;
  testCode: string;
};

export type Scenario = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: ReactNode;
  summary: string;
  levels: Level[];
};

export type Status = "idle" | "running" | "success" | "error";