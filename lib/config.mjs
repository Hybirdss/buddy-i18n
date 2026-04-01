import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const CLAUDE_CONFIG_PATHS = [
	join(homedir(), ".claude.json"),
	join(homedir(), ".claude", ".config.json"),
];

const BACKUP_PATH = join(homedir(), ".claude-buddy-i18n-backup.json");

function getClaudeConfigPath() {
	for (const p of CLAUDE_CONFIG_PATHS) {
		if (existsSync(p)) return p;
	}
	return CLAUDE_CONFIG_PATHS[0];
}

function readClaudeConfig() {
	const configPath = getClaudeConfigPath();
	if (!existsSync(configPath)) return null;
	return JSON.parse(readFileSync(configPath, "utf-8"));
}

function writeClaudeConfig(config) {
	const configPath = getClaudeConfigPath();
	writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", {
		mode: 0o600,
	});
}

export function getCompanion() {
	const config = readClaudeConfig();
	return config?.companion ?? null;
}

export function setPersonality(personality) {
	const config = readClaudeConfig();
	if (!config) {
		throw new Error(
			"Claude config not found. Make sure Claude Code is installed.",
		);
	}
	if (!config.companion) {
		throw new Error(
			"No companion found. Run /buddy in Claude Code first to hatch one.",
		);
	}
	config.companion.personality = personality;
	writeClaudeConfig(config);
}

export function setName(name) {
	const config = readClaudeConfig();
	if (!config?.companion) {
		throw new Error(
			"No companion found. Run /buddy in Claude Code first to hatch one.",
		);
	}
	config.companion.name = name;
	writeClaudeConfig(config);
}

export function backupPersonality() {
	const companion = getCompanion();
	if (!companion) return false;
	if (existsSync(BACKUP_PATH)) return true;
	writeFileSync(
		BACKUP_PATH,
		JSON.stringify(
			{
				personality: companion.personality,
				name: companion.name,
				backedUpAt: new Date().toISOString(),
			},
			null,
			2,
		) + "\n",
	);
	return true;
}

export function restorePersonality() {
	if (!existsSync(BACKUP_PATH)) return false;
	const backup = JSON.parse(readFileSync(BACKUP_PATH, "utf-8"));
	const config = readClaudeConfig();
	if (!config?.companion) return false;
	config.companion.personality = backup.personality;
	if (backup.name) config.companion.name = backup.name;
	writeClaudeConfig(config);
	return true;
}

export function hasBackup() {
	return existsSync(BACKUP_PATH);
}
