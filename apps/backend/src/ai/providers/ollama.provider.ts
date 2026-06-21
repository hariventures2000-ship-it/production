import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AIProvider, SprintSummaryInput, ProjectSummaryInput,
  RiskPredictionInput, TaskAssignmentInput,
  RiskPredictionResult, TaskAssignmentResult,
} from './ai-provider.interface';

@Injectable()
export class OllamaProvider implements AIProvider {
  readonly providerName = 'ollama';
  private readonly logger = new Logger(OllamaProvider.name);
  private readonly baseUrl: string;
  private readonly summaryModel: string;
  private readonly analysisModel: string;
  private readonly timeout: number;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get<string>('OLLAMA_BASE_URL', 'http://localhost:11434');
    this.summaryModel = config.get<string>('OLLAMA_MODEL_SUMMARY', 'llama3.1');
    this.analysisModel = config.get<string>('OLLAMA_MODEL_ANALYSIS', 'qwen3');
    this.timeout = config.get<number>('OLLAMA_TIMEOUT_MS', 60000);
  }

  async generateSprintSummary(input: SprintSummaryInput): Promise<string> {
    const prompt = `
You are a project management AI assistant for Hariventure Digital Production.
Generate a concise, professional sprint summary for the client and team.

Sprint: ${input.sprintName}
Project: ${input.projectName}
Period: ${input.startDate} to ${input.endDate}
Tasks: ${input.completedTasks}/${input.totalTasks} completed
Velocity: ${input.velocity} story points
Team: ${input.teamMembers.join(', ')}
${input.issues?.length ? `Issues: ${input.issues.join('; ')}` : ''}

Write a 3-paragraph professional summary covering: achievements, status, and next steps.
Keep it under 200 words. Use clear, non-technical language for client-facing sections.
    `.trim();

    return this.callOllama(this.summaryModel, prompt);
  }

  async generateProjectSummary(input: ProjectSummaryInput): Promise<string> {
    const prompt = `
You are a senior project manager at Hariventure Digital Production.
Generate a professional client-facing project status update.

Project: ${input.projectName}
Client: ${input.clientName}
Status: ${input.status}
Completion: ${input.completionPercentage}%
Budget used: ${((input.actualCost / input.budget) * 100).toFixed(1)}%
Timeline: ${input.startDate} → ${input.estimatedEndDate}
Milestones: ${input.milestones.map((m) => `${m.title} (${m.status})`).join(', ')}
Team size: ${input.team.length} members

Write a professional 3-paragraph status report. Highlight achievements, current state, 
and upcoming milestones. Keep language accessible for non-technical clients.
    `.trim();

    return this.callOllama(this.summaryModel, prompt);
  }

  async generateCeoDigest(data: Record<string, unknown>): Promise<string> {
    const prompt = `
You are an executive AI assistant for the CEO of Hariventure Digital Production.
Generate a concise executive digest from this operational data:

${JSON.stringify(data, null, 2)}

Provide:
1. Key highlights (3-5 bullet points)
2. Areas requiring attention
3. Strategic recommendations

Keep it under 300 words. Use executive language. Focus on business impact.
    `.trim();

    return this.callOllama(this.analysisModel, prompt);
  }

  async predictProjectRisk(input: RiskPredictionInput): Promise<RiskPredictionResult> {
    const prompt = `
You are a project risk analyst. Analyze this project data and return a JSON risk assessment.

Project: ${input.projectName}
Progress: ${input.completionPercentage}% complete
Timeline: ${input.startDate} → ${input.estimatedEndDate}
${input.delayDays ? `Current delay: ${input.delayDays} days` : 'On schedule'}
Budget: ${((input.actualCost / input.budget) * 100).toFixed(1)}% used
Tasks: ${input.completedTasks}/${input.totalTasks} done
Team size: ${input.teamSize}

Return ONLY valid JSON with this exact structure:
{
  "overallRiskScore": <0-100>,
  "deliveryRisk": { "score": <0-100>, "reason": "<string>" },
  "resourceRisk": { "score": <0-100>, "reason": "<string>" },
  "budgetRisk": { "score": <0-100>, "reason": "<string>" },
  "recommendations": ["<string>", "<string>", "<string>"]
}
    `.trim();

    const raw = await this.callOllama(this.analysisModel, prompt);

    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');
      return JSON.parse(jsonMatch[0]) as RiskPredictionResult;
    } catch {
      this.logger.warn('Risk prediction JSON parse failed, using fallback scoring');
      return this.fallbackRiskScore(input);
    }
  }

  async recommendTaskAssignment(input: TaskAssignmentInput): Promise<TaskAssignmentResult> {
    if (!input.availableEmployees.length) {
      throw new Error('No available employees for assignment');
    }

    const prompt = `
You are a smart task assignment system. Recommend the best employee for this task.

Task: ${input.taskTitle}
Description: ${input.taskDescription}
Required sub-role: ${input.requiredSubRole}
Required skills: ${input.requiredSkills.join(', ')}

Available employees:
${input.availableEmployees.map((e, i) =>
  `${i + 1}. ID: ${e.id} | Name: ${e.name} | Role: ${e.subRole} | Skills: ${e.skills.join(', ')} | Current tasks: ${e.currentTaskCount} | Performance: ${e.performanceScore}/100`
).join('\n')}

Return ONLY valid JSON:
{
  "recommendedEmployeeId": "<id>",
  "confidenceScore": <0-100>,
  "reasoning": "<one sentence explanation>",
  "alternativeIds": ["<id>", "<id>"]
}
    `.trim();

    const raw = await this.callOllama(this.analysisModel, prompt);

    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');
      return JSON.parse(jsonMatch[0]) as TaskAssignmentResult;
    } catch {
      this.logger.warn('Task assignment JSON parse failed, using score-based fallback');
      return this.fallbackAssignment(input);
    }
  }

  // ─── PRIVATE HELPERS ──────────────────────────────────────────────

  private async callOllama(model: string, prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt, stream: false }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as { response: string };
      return data.response?.trim() || '';
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new Error(`Ollama request timed out after ${this.timeout}ms`);
      }
      this.logger.error('Ollama call failed:', (err as Error).message);
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private fallbackRiskScore(input: RiskPredictionInput): RiskPredictionResult {
    const budgetUsed = (input.actualCost / input.budget) * 100;
    const taskCompletion = (input.completedTasks / input.totalTasks) * 100;
    const budgetRisk = Math.max(0, budgetUsed - taskCompletion);
    const deliveryRisk = input.delayDays ? Math.min(100, input.delayDays * 3) : 20;
    const overallRisk = Math.round((budgetRisk * 0.35 + deliveryRisk * 0.4 + 20 * 0.25));

    return {
      overallRiskScore: overallRisk,
      deliveryRisk: { score: deliveryRisk, reason: 'Based on timeline analysis' },
      resourceRisk: { score: 20, reason: 'Insufficient data for resource analysis' },
      budgetRisk: { score: Math.round(budgetRisk), reason: 'Based on budget vs completion ratio' },
      recommendations: [
        'Review sprint velocity and adjust estimates',
        'Monitor budget utilization weekly',
        'Ensure team capacity matches workload',
      ],
    };
  }

  private fallbackAssignment(input: TaskAssignmentInput): TaskAssignmentResult {
    const scored = input.availableEmployees
      .map((e) => {
        const skillMatch = input.requiredSkills.filter((s) =>
          e.skills.some((es) => es.toLowerCase().includes(s.toLowerCase()))
        ).length;
        const roleMatch = e.subRole === input.requiredSubRole ? 30 : 0;
        const workloadPenalty = e.currentTaskCount * 5;
        const score = skillMatch * 20 + roleMatch + e.performanceScore * 0.3 - workloadPenalty;
        return { ...e, score };
      })
      .sort((a, b) => b.score - a.score);

    return {
      recommendedEmployeeId: scored[0].id,
      confidenceScore: Math.min(95, Math.max(40, scored[0].score)),
      reasoning: `Best skill match and availability based on current workload and performance`,
      alternativeIds: scored.slice(1, 3).map((e) => e.id),
    };
  }
}
