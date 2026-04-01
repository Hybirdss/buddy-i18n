#!/usr/bin/env node

import chalk from "chalk";
import { select } from "@inquirer/prompts";
import {
	getCompanion,
	setPersonality,
	backupPersonality,
	restorePersonality,
	hasBackup,
} from "../lib/config.mjs";
import {
	listLocales,
	listStyles,
	getPersonality,
	SPECIES,
} from "../lib/locales.mjs";

function parseArgs(argv) {
	const args = argv.slice(2);
	const flags = {};
	const positional = [];

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--style" || arg === "-s") flags.style = args[++i];
		else if (arg === "--species") flags.species = args[++i];
		else if (arg === "--yes" || arg === "-y") flags.yes = true;
		else if (arg === "--print") flags.print = true;
		else if (!arg.startsWith("-")) positional.push(arg);
	}

	return { command: positional[0], flags };
}

async function runApply(langCode, flags) {
	const companion = getCompanion();
	if (!companion) {
		console.error(
			chalk.red(
				"\n  No companion found. Run /buddy in Claude Code first to hatch one.\n",
			),
		);
		process.exit(1);
	}

	const locales = listLocales();
	const locale = locales.find((l) => l.code === langCode);
	if (!locale) {
		console.error(chalk.red(`\n  Language "${langCode}" not found.\n`));
		console.log("  Available languages:");
		for (const l of locales) {
			console.log(`    ${l.flag}  ${chalk.bold(l.code)} — ${l.label}`);
		}
		console.log();
		process.exit(1);
	}

	// Determine style
	let style = flags.style || "default";
	if (!flags.style && !flags.yes) {
		const styles = listStyles(langCode);
		if (styles.length > 1) {
			style = await select({
				message: `${locale.flag} Style`,
				choices: styles.map((s) => ({
					name: `${s.name} — ${s.description}`,
					value: s.id,
				})),
			});
		}
	}

	// Detect species from current companion name or personality
	const species = detectSpecies(companion);

	// Get the personality text
	const personality = getPersonality(langCode, species, style);

	// Print mode: just output the personality text
	if (flags.print) {
		process.stdout.write(personality);
		return;
	}

	// Backup original personality (only first time)
	backupPersonality();

	// Apply
	setPersonality(personality);

	console.log();
	console.log(
		chalk.green("  ✓"),
		`Buddy now speaks ${locale.flag} ${locale.label}!`,
	);
	console.log(chalk.dim(`    Species: ${species} | Style: ${style}`));
	console.log(chalk.dim("    Restart Claude Code to see the change."));
	console.log();
}

async function runInteractive() {
	const companion = getCompanion();
	if (!companion) {
		console.error(
			chalk.red(
				"\n  No companion found. Run /buddy in Claude Code first to hatch one.\n",
			),
		);
		process.exit(1);
	}

	const locales = listLocales();

	console.log();
	console.log(chalk.bold("  🌍 buddy-i18n"));
	console.log(chalk.dim("  Make your Claude Code buddy speak your language"));
	console.log();

	const langCode = await select({
		message: "Language",
		choices: locales.map((l) => ({
			name: `${l.flag}  ${l.label}`,
			value: l.code,
		})),
	});

	await runApply(langCode, {});
}

// CJK-aware string width (fullwidth chars count as 2)
function stringWidth(str) {
	let width = 0;
	for (const ch of str) {
		const code = ch.codePointAt(0);
		if (
			(code >= 0x1100 && code <= 0x115f) ||
			(code >= 0x2e80 && code <= 0xa4cf && code !== 0x303f) ||
			(code >= 0xac00 && code <= 0xd7a3) ||
			(code >= 0xf900 && code <= 0xfaff) ||
			(code >= 0xfe10 && code <= 0xfe6f) ||
			(code >= 0xff01 && code <= 0xff60) ||
			(code >= 0xffe0 && code <= 0xffe6) ||
			(code >= 0x20000 && code <= 0x2fffd) ||
			(code >= 0x30000 && code <= 0x3fffd)
		) {
			width += 2;
		} else {
			width += 1;
		}
	}
	return width;
}

function padEndVisual(str, targetWidth) {
	const diff = targetWidth - stringWidth(str);
	return str + " ".repeat(Math.max(0, diff));
}

const LANG_TAGLINES = {
	ko: "야, 버그 또 났어 🐛",
	ja: "バグだよ、ほら 🐛",
	"zh-cn": "又有 bug 啦 🐛",
	es: "¡Olé, otro bug! 🐛",
	fr: "Oh là là, un bug ! 🐛",
	de: "Ach, noch ein Bug! 🐛",
	"pt-br": "Eita, mais um bug! 🐛",
};

function runList() {
	const locales = listLocales();
	console.log();
	console.log(chalk.bold("  🌍 buddy-i18n") + chalk.dim(" — Make your buddy speak your language"));
	console.log();
	for (const l of locales) {
		const styles = listStyles(l.code);
		const styleNames = styles.map((s) => s.id).join(", ");
		const tagline = LANG_TAGLINES[l.code] || "";
		console.log(
			`  ${l.flag}  ${chalk.bold(l.code.padEnd(6))} ${padEndVisual(l.label, 22)} ${chalk.yellow(padEndVisual(tagline, 24))} ${chalk.dim(styleNames)}`,
		);
	}
	console.log();
	console.log(chalk.dim("  Usage: npx buddy-i18n <lang> [--style <name>]"));
	console.log();
}

function runCurrent() {
	const companion = getCompanion();
	if (!companion) {
		console.log(
			chalk.dim(
				"\n  No companion found. Run /buddy in Claude Code first.\n",
			),
		);
		return;
	}

	console.log();
	console.log(chalk.bold(`  🐾 ${companion.name}`));
	console.log(chalk.dim(`  ${companion.personality}`));
	console.log();
}

function runRestore() {
	if (!hasBackup()) {
		console.log(
			chalk.dim(
				"\n  No backup found. Nothing to restore.\n",
			),
		);
		return;
	}

	const success = restorePersonality();
	if (success) {
		console.log(
			chalk.green("\n  ✓"),
			"Original personality restored. Restart Claude Code.\n",
		);
	} else {
		console.error(chalk.red("\n  Failed to restore. No companion found.\n"));
	}
}

function detectSpecies(companion) {
	// Try to detect species from the personality text or name
	const text = `${companion.personality} ${companion.name}`.toLowerCase();
	for (const s of SPECIES) {
		if (text.includes(s)) return s;
	}
	// Korean species names
	const koMap = {
		오리: "duck", 거위: "goose", 블롭: "blob", 고양이: "cat",
		드래곤: "dragon", 용: "dragon", 문어: "octopus", 올빼미: "owl",
		펭귄: "penguin", 거북: "turtle", 달팽이: "snail", 유령: "ghost",
		아홀로틀: "axolotl", 카피바라: "capybara", 선인장: "cactus",
		로봇: "robot", 토끼: "rabbit", 버섯: "mushroom", 통통: "chonk",
	};
	for (const [ko, en] of Object.entries(koMap)) {
		if (text.includes(ko)) return en;
	}
	// Default to cat if can't detect
	return "cat";
}

function printHelp() {
	console.log(`
${chalk.bold("buddy-i18n")} — Make your Claude Code buddy speak your language

${chalk.bold("Usage:")}
  buddy-i18n                       Interactive language picker
  buddy-i18n <lang>                Apply language (e.g. ko, ja, zh-cn)
  buddy-i18n <lang> --style <name> Apply with specific style
  buddy-i18n list                  Show available languages & styles
  buddy-i18n current               Show current buddy personality
  buddy-i18n restore               Restore original personality
  buddy-i18n help                  Show this help

${chalk.bold("Examples:")}
  npx buddy-i18n ko                Korean (default style)
  npx buddy-i18n ko -s tsundere    Korean tsundere style
  npx buddy-i18n ja                Japanese
  npx buddy-i18n zh-cn             Simplified Chinese

${chalk.bold("Options:")}
  -s, --style <name>   Personality style (default, tsundere, mentor, etc.)
  --species <name>     Override species detection
  --print              Print personality text to stdout (no apply)
  -y, --yes            Skip interactive prompts
`);
}

// Main
const { command, flags } = parseArgs(process.argv);

try {
	switch (command) {
		case "list":
			runList();
			break;
		case "current":
			runCurrent();
			break;
		case "restore":
			runRestore();
			break;
		case "help":
		case "--help":
		case "-h":
			printHelp();
			break;
		default:
			if (command && !command.startsWith("-")) {
				await runApply(command, flags);
			} else {
				await runInteractive();
			}
	}
} catch (err) {
	if (err.name === "ExitPromptError") {
		process.exit(0);
	}
	console.error(chalk.red(`\n  Error: ${err.message}\n`));
	process.exit(1);
}
