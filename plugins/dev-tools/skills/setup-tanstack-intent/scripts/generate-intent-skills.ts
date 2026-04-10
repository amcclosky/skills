#!/usr/bin/env node

/**
 * Generates .claude/rules/intent-skills.md from `npx @tanstack/intent@latest list --json`.
 *
 * Usage:
 *   npx @tanstack/intent@latest list --json | node scripts/generate-intent-skills.ts
 *   npx @tanstack/intent@latest list --json | node scripts/generate-intent-skills.ts --output path/to/output.md
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    output: { type: "string", default: ".claude/rules/intent-skills.md" },
  },
});

const input = readFileSync(0, "utf-8");
const data = JSON.parse(input);

if (!data.packages?.length) {
  console.error("No intent-enabled packages found. Nothing to generate.");
  process.exit(1);
}

interface Skill {
  name: string;
  path: string;
  description: string;
  type?: string;
}

interface Package {
  name: string;
  version: string;
  skills: Skill[];
}

const lines: string[] = [];

for (const pkg of data.packages as Package[]) {
  for (const skill of pkg.skills) {
    // Prefer stable node_modules/<package>/skills/... path.
    // If the path goes through .pnpm/ or .bun/ (versioned internals),
    // extract the logical path and check if it resolves via a top-level symlink.
    let loadPath = skill.path;
    const internalsMatch = loadPath.match(
      /node_modules\/\.(?:pnpm|bun)\/[^/]+\/node_modules\/(.+)/,
    );
    if (internalsMatch) {
      const stablePath = `node_modules/${internalsMatch[1]}`;
      if (existsSync(stablePath)) {
        loadPath = stablePath;
      }
      // Otherwise keep the original path — it's a transitive dep with no top-level symlink
    }

    lines.push(`  - task: "${skill.description}"`);
    lines.push(`    load: "${loadPath}"`);
  }
}

const output = `# Intent Skills

When working on the tasks below, load the linked skill file into context.

After updating npm packages, regenerate this file: \`/setup-tanstack-intent\`

<!-- intent-skills:start -->
skills:
${lines.join("\n")}
<!-- intent-skills:end -->
`;

const outPath = resolve(values.output!);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, output);
console.log(`Wrote ${outPath}`);
