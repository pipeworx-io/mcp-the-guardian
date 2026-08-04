# @pipeworx/the-guardian

[The Guardian Open Platform](https://open-platform.theguardian.com/documentation/) MCP — articles, sections, tags, content. Free dev key (12 req/sec, 5k/day).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_GUARDIAN_KEY`. BYO: `?_apiKey=…`.

## Tools

- `search(q?, section?, tag?, from_date?, to_date?, page?, page_size?, order_by?, show_fields?, show_tags?, show_elements?)` — content search
- `item(id, show_fields?, show_tags?, show_blocks?, show_references?)` — single article by id (e.g. `politics/2025/jan/01/...`)
- `sections(q?)` — list sections (politics, sport, world, …)
- `tags(q?, type?, section?, page?, page_size?)` — list tags
- `editions(q?)` — editions (uk, us, au, international)

## Data source

`https://content.guardianapis.com`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "the-guardian": {
      "url": "https://gateway.pipeworx.io/the-guardian/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about The Guardian data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
