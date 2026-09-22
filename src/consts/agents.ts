import { SerializableTypes } from "../types/serializableTypes";

export interface AgentsMeta<TFileShape extends object> {
  name: string;
  provider: string;
  description: string;
  capabilities: {
    /**
     * Directory that the tool scans for skills
     */
    skills?: string;
    /**
     * File that the tool reads for prompts/instructions
     */
    instructions?: string;
    /**
     * MCP configuring
     */
    mcp?: {
      /**
       * File that the tool reads for setting MCP servers
       */
      file: string;
      read(current: TFileShape): McpDetails[]
      /**
       * Function that configures the files
       * @param mcpDetails Details of the MCP file that's passed in
       * @param current 
       */
      configure(mcpDetails: McpDetails, current?: TFileShape): TFileShape;
    };
  };
  standards?: { skills?: boolean; instructions?: boolean; };
}

interface BaseMcpDetails {
  name: string;
}

interface StdioMcpDetails extends BaseMcpDetails {
  type: "stdio";
  bin: string;
  args: string[];
  env?: {};
}

interface HttpMcpDetails extends BaseMcpDetails {
  type: "http";
  url: string;
  headers?: Record<string, string>;
  oauth?: {
    clientId: string;
  };
}

export type McpDetails = StdioMcpDetails | HttpMcpDetails;

export interface SkillData {
  data: {
    name: string
    description: string
    license?: string
    compatibility?: string
    allowedTools?: string[]
    metadata?: Record<string, string>
  }
  body: string
  scripts: {
    [name: `${string}.md`]: {
      frontmatter?: Record<string, SerializableTypes>
      body: string
    }
  }
  assets: Record<string, Buffer>
}

function defineAgent<const TFileShape extends object>(agent: AgentsMeta<TFileShape>): AgentsMeta<TFileShape> {
  return agent
}

export type SupportedAgents = "generic" | "vscode-copilot" | "github-copilot" | "opencode"

export const agents: Readonly<Record<SupportedAgents, AgentsMeta<object>>> = {
  generic: {
    name: "Generic",
    provider: "the ecosystem",
    description: "Configuration that works across multiple agent tools.",
    capabilities: { skills: ".agents/skills", instructions: "AGENTS.md" },
  },
  "vscode-copilot": defineAgent({
    name: "VS Code (GitHub Copilot)",
    provider: "Microsoft (GitHub)",
    description: "GitHub Copilot, integrated into your editor.",
    capabilities: {
      skills: ".github/skills",
      instructions: ".github/copilot-instructions.md",
      mcp: {
        file: ".vscode/mcp.json",
        read() {
          return []
        },
        configure() {
          return {}
        },
      },
    },
    standards: {
      instructions: true,
    }
  }),
  "github-copilot": {
    name: "GitHub Copilot",
    provider: "GitHub",
    description: "A coding agent integrated into GitHub.",
    capabilities: {
      skills: ".github/skills",
      instructions: ".github/copilot-instructions.md"
    },
    standards: {
      instructions: true
    }
  },
  "opencode": defineAgent({
    name: "OpenCode",
    provider: "Anomaly",
    description: "An open-source coding agent with access to over 1000 models.",
    capabilities: {},
    standards: {
      skills: true,
      instructions: true,
    }
  })
} as const;
