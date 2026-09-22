import fs from "node:fs";

import matter from "gray-matter";

import { agents as agentList, SupportedAgents } from "./consts/agents";
import { SerializableTypes } from "./types/serializableTypes";

interface ParsedAgentInstructions {
  frontmatter: Record<string, SerializableTypes>;
  content: string
  raw: string
}

export function readAgentInstructions(agent: SupportedAgents, options?: {
    encoding?: BufferEncoding
}): ParsedAgentInstructions | { error: unknown } | null | undefined {
  const instructionsFilePath = agentList[agent].capabilities.instructions;
  if (instructionsFilePath) {
    try {
      const file = fs.readFileSync(instructionsFilePath).toString(options?.encoding);
      const parsed = matter(file);
      return {
        frontmatter: parsed.data as Record<string, SerializableTypes>,
        content: parsed.content,
        raw: file,
      };
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENONET') {
        return null
      } else {
        return { error }
      }
    }
  } else {
    return;
  }
}

export function writeAgentInstructions(data: Omit<ParsedAgentInstructions, 'raw'>, agents: SupportedAgents[], options?: {
    force?: boolean
}) {
    const errors = []
    for (const agent of agents) {
        const instructionsFilePath = agentList[agent].capabilities.instructions
        if (instructionsFilePath) {
            if (!options?.force && fs.existsSync(instructionsFilePath)) {
                errors.push({ errorCode: 'file_already_exists' })
            } else {
                const file = matter.stringify(data.content, data.frontmatter)
                fs.writeFileSync(instructionsFilePath, file)
            }
        }
    }
    return errors
}
