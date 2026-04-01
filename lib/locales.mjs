import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "..", "locales");

export function listLocales() {
	const dirs = readdirSync(LOCALES_DIR, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name);

	return dirs
		.map((code) => {
			const meta = loadMeta(code);
			if (!meta) return null;
			return { code, ...meta };
		})
		.filter(Boolean);
}

export function loadMeta(langCode) {
	const metaPath = join(LOCALES_DIR, langCode, "meta.json");
	if (!existsSync(metaPath)) return null;
	return JSON.parse(readFileSync(metaPath, "utf-8"));
}

export function listStyles(langCode) {
	const dir = join(LOCALES_DIR, langCode);
	if (!existsSync(dir)) return [];

	return readdirSync(dir)
		.filter((f) => f.endsWith(".json") && f !== "meta.json")
		.map((f) => {
			const data = JSON.parse(readFileSync(join(dir, f), "utf-8"));
			return {
				id: f.replace(".json", ""),
				name: data.name,
				description: data.description,
			};
		});
}

export function loadPersonalities(langCode, style = "default") {
	const filePath = join(LOCALES_DIR, langCode, `${style}.json`);
	if (!existsSync(filePath)) {
		throw new Error(
			`Style "${style}" not found for language "${langCode}". Run: buddy-i18n list`,
		);
	}
	return JSON.parse(readFileSync(filePath, "utf-8"));
}

export function getPersonality(langCode, species, style = "default") {
	const data = loadPersonalities(langCode, style);
	const personality = data.personalities[species];
	if (!personality) {
		throw new Error(
			`No personality found for species "${species}" in ${langCode}/${style}`,
		);
	}
	return personality;
}

export const SPECIES = [
	"duck",
	"goose",
	"blob",
	"cat",
	"dragon",
	"octopus",
	"owl",
	"penguin",
	"turtle",
	"snail",
	"ghost",
	"axolotl",
	"capybara",
	"cactus",
	"robot",
	"rabbit",
	"mushroom",
	"chonk",
];
