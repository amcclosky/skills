# Desktop Safari (safari-mcp)

The plugin ships the Safari MCP server (`/usr/bin/safaridriver --mcp`, Safari 27+) as `safari-mcp`. It drives **desktop** Safari on this Mac: open and switch tabs, `navigate_to_url`, `get_page_content`, `screenshot`, `page_interactions` (click, type, scroll, hover, keys), `evaluate_javascript` (takes `expression`, which must `return` its value), `list_network_requests`, `browser_console_messages`, `browser_dialogs`, `set_emulated_media`, and `set_viewport_size`.

- Use it for WebKit-specific checks on desktop: console errors, network requests, JS evaluation, narrow-width layouts.
- It is not Mobile Safari. After `set_viewport_size` to 402 wide the page still reports a Macintosh user agent, `maxTouchPoints` 0, and no touch events, and the height is capped by the window (770 here). For "on mobile" requests use [ios-simulator.md](ios-simulator.md).
- One-time setup: in Safari, Settings → Developer → check "Allow remote automation and external agents" (enable the Develop menu first). Navigate first: asking for tabs before a window exists can return an error.
- It opens a Safari window that shows a banner saying an agent controls it, and does not use the persistent Helium profile or the agent vault.
