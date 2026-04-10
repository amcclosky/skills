import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = join(import.meta.dirname, "..");

function main(): void {
  const pluginName = process.argv[2];
  if (!pluginName) {
    console.error("Usage: node scripts/bump-version.ts <plugin-name>");
    process.exit(1);
  }

  const pluginJsonPath = join(rootDir, "plugins", pluginName, ".claude-plugin", "plugin.json");
  const marketplacePath = join(rootDir, ".claude-plugin", "marketplace.json");

  const pluginJson = JSON.parse(readFileSync(pluginJsonPath, "utf-8"));
  const marketplaceJson = JSON.parse(readFileSync(marketplacePath, "utf-8"));

  const oldVersion: string = pluginJson.version;
  const [oldYear, oldMonth, oldMicro] = oldVersion.split(".").map(Number);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  let micro: number;
  if (year === oldYear && month === oldMonth) {
    micro = oldMicro + 1;
  } else {
    micro = 0;
  }

  const newVersion = `${year}.${month}.${micro}`;

  pluginJson.version = newVersion;
  writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2) + "\n");

  const entry = marketplaceJson.plugins?.find((p: { name: string }) => p.name === pluginName);
  if (entry) {
    entry.version = newVersion;
    writeFileSync(marketplacePath, JSON.stringify(marketplaceJson, null, 2) + "\n");
  } else {
    console.warn(`Warning: plugin "${pluginName}" not found in marketplace.json`);
  }

  console.log(`${pluginName}: ${oldVersion} → ${newVersion}`);
}

main();
