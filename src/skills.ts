import { SkillData, SupportedAgents } from "./consts/agents";

export function listSkills(agent: SupportedAgents, options?: {}) {}

export function loadSkill(id: string, agent: SupportedAgents, options?: {}) {}

export function writeSkill(id: string, skill: SkillData, agents: SupportedAgents[], options?: {}) {}
