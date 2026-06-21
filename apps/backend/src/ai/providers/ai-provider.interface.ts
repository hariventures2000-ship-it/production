// ═══════════════════════════════════════════════════════════════════
// AI Provider Interface — Hariventure Digital Production
// All AI providers must implement this interface for swap-ability
// ═══════════════════════════════════════════════════════════════════

export interface SprintSummaryInput {
  sprintName: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  velocity: number;
  startDate: string;
  endDate: string;
  teamMembers: string[];
  issues?: string[];
}

export interface ProjectSummaryInput {
  projectName: string;
  clientName: string;
  status: string;
  completionPercentage: number;
  budget: number;
  actualCost: number;
  startDate: string;
  estimatedEndDate: string;
  milestones: Array<{ title: string; status: string }>;
  team: string[];
}

export interface RiskPredictionInput {
  projectName: string;
  startDate: string;
  estimatedEndDate: string;
  completionPercentage: number;
  budget: number;
  actualCost: number;
  totalTasks: number;
  completedTasks: number;
  teamSize: number;
  delayDays?: number;
}

export interface TaskAssignmentInput {
  taskTitle: string;
  taskDescription: string;
  requiredSubRole: string;
  requiredSkills: string[];
  availableEmployees: Array<{
    id: string;
    name: string;
    subRole: string;
    skills: string[];
    currentTaskCount: number;
    performanceScore: number;
  }>;
}

export interface RiskPredictionResult {
  overallRiskScore: number; // 0-100
  deliveryRisk: { score: number; reason: string };
  resourceRisk: { score: number; reason: string };
  budgetRisk: { score: number; reason: string };
  recommendations: string[];
}

export interface TaskAssignmentResult {
  recommendedEmployeeId: string;
  confidenceScore: number; // 0-100
  reasoning: string;
  alternativeIds: string[];
}

export interface AIProvider {
  readonly providerName: string;

  generateSprintSummary(input: SprintSummaryInput): Promise<string>;
  generateProjectSummary(input: ProjectSummaryInput): Promise<string>;
  generateCeoDigest(data: Record<string, unknown>): Promise<string>;
  predictProjectRisk(input: RiskPredictionInput): Promise<RiskPredictionResult>;
  recommendTaskAssignment(input: TaskAssignmentInput): Promise<TaskAssignmentResult>;
}
