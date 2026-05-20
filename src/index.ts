interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * The Guardian Open Platform MCP.
 */


const BASE = 'https://content.guardianapis.com';
const UA = 'pipeworx-mcp-the-guardian/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Content search.',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string' },
        section: { type: 'string' },
        tag: { type: 'string' },
        from_date: { type: 'string' },
        to_date: { type: 'string' },
        page: { type: 'number' },
        page_size: { type: 'number' },
        order_by: { type: 'string' },
        show_fields: { type: 'string' },
        show_tags: { type: 'string' },
        show_elements: { type: 'string' },
      },
    },
  },
  {
    name: 'item',
    description: 'Single article by id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' }, show_fields: { type: 'string' }, show_tags: { type: 'string' }, show_blocks: { type: 'string' }, show_references: { type: 'string' } },
      required: ['id'],
    },
  },
  { name: 'sections', description: 'List sections.', inputSchema: { type: 'object', properties: { q: { type: 'string' } } } },
  {
    name: 'tags',
    description: 'List tags.',
    inputSchema: { type: 'object', properties: { q: { type: 'string' }, type: { type: 'string' }, section: { type: 'string' }, page: { type: 'number' }, page_size: { type: 'number' } } },
  },
  { name: 'editions', description: 'Editions.', inputSchema: { type: 'object', properties: { q: { type: 'string' } } } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Guardian Open Platform requires an API key. Set PLATFORM_GUARDIAN_KEY or pass ?_apiKey=… (free at https://open-platform.theguardian.com/access/).');
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams({ 'api-key': apiKey });
    if (params) for (const [k, v] of Object.entries(params)) if (k !== '_apiKey' && v != null) p.set(k.replace(/_/g, '-'), String(v));
    const res = await fetch(`${BASE}${path}?${p}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (res.status === 401 || res.status === 403) throw new Error('Guardian: invalid API key.');
    if (!res.ok) throw new Error(`Guardian: ${res.status}`);
    return res.json();
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'search':
      return get('/search', args);
    case 'item':
      return get(`/${reqStr('id', '"politics/2025/jan/01/example"')}`, args);
    case 'sections':
      return get('/sections', args);
    case 'tags':
      return get('/tags', args);
    case 'editions':
      return get('/editions', args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
