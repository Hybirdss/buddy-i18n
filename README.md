# buddy-i18n

Make your Claude Code buddy speak your language.

[English](#quick-start) · [한국어](#한국어) · [日本語](#日本語) · [中文](#中文) · [Español](#español) · [Français](#français) · [Deutsch](#deutsch) · [Português](#português-brasil)

## Quick Start

```bash
npx buddy-i18n ko       # 한국어
npx buddy-i18n ja       # 日本語
npx buddy-i18n zh-cn    # 中文
npx buddy-i18n es       # Español
npx buddy-i18n fr       # Français
npx buddy-i18n de       # Deutsch
npx buddy-i18n pt-br    # Português
```

Restart Claude Code. Your buddy now speaks your language.

## What It Does

Claude Code's `/buddy` companion always speaks English by default. This tool patches the personality text in `~/.claude.json` so your buddy speaks in your language instead.

- Zero dependencies on Claude Code internals (no binary patching)
- Backs up your original personality automatically
- Community-curated, native-speaker-quality translations
- Multiple personality styles per language

## Usage

```bash
# Interactive — pick language and style
npx buddy-i18n

# Direct — apply immediately
npx buddy-i18n ko

# With style
npx buddy-i18n ko --style tsundere
npx buddy-i18n ko --style mentor

# See what's available
npx buddy-i18n list

# Check current personality
npx buddy-i18n current

# Restore original English personality
npx buddy-i18n restore
```

## Available Languages

| Flag | Code | Language | Styles |
|------|------|----------|--------|
| 🇰🇷 | `ko` | 한국어 | default, tsundere, mentor |
| 🇯🇵 | `ja` | 日本語 | default |
| 🇨🇳 | `zh-cn` | 简体中文 | default |
| 🇪🇸 | `es` | Español | default |
| 🇫🇷 | `fr` | Français | default |
| 🇩🇪 | `de` | Deutsch | default |
| 🇧🇷 | `pt-br` | Português (Brasil) | default |

## Contributing a Language

Adding a new language is easy — no coding required, just JSON.

### 1. Create locale files

```bash
mkdir locales/xx        # your language code
```

### 2. Add meta.json

```json
{
  "label": "Your Language",
  "flag": "🏳️",
  "contributors": ["your-github-username"]
}
```

### 3. Add default.json

```json
{
  "name": "default",
  "description": "Short description in your language",
  "personalities": {
    "duck": "Your personality text for duck...",
    "goose": "Your personality text for goose...",
    "blob": "...",
    "cat": "...",
    "dragon": "...",
    "octopus": "...",
    "owl": "...",
    "penguin": "...",
    "turtle": "...",
    "snail": "...",
    "ghost": "...",
    "axolotl": "...",
    "capybara": "...",
    "cactus": "...",
    "robot": "...",
    "rabbit": "...",
    "mushroom": "...",
    "chonk": "..."
  }
}
```

Each personality should:
- Be 1-2 sentences, natural in your language
- Capture the species' character trait
- End with a note that the buddy speaks in your language

### 4. Submit a PR

That's it. See [CONTRIBUTING.md](CONTRIBUTING.md) for species trait descriptions.

## Adding a Style

Styles are alternate personality packs for an existing language. Create a new JSON file in the locale directory (e.g., `locales/ko/tsundere.json`) following the same format as `default.json`.

---

## 한국어

Claude Code 버디가 한국어로 말하게 합니다.

```bash
npx buddy-i18n ko                # 기본 스타일
npx buddy-i18n ko -s tsundere    # 츤데레
npx buddy-i18n ko -s mentor      # 멘토
npx buddy-i18n restore           # 원래대로 복원
```

실행 후 Claude Code를 재시작하면 적용됩니다.

## 日本語

Claude Codeのバディを日本語で話すようにします。

```bash
npx buddy-i18n ja                # デフォルト
npx buddy-i18n restore           # 元に戻す
```

実行後、Claude Codeを再起動すると適用されます。

## 中文

让你的 Claude Code 伙伴说中文。

```bash
npx buddy-i18n zh-cn             # 默认
npx buddy-i18n restore           # 恢复原始
```

运行后重启 Claude Code 即可生效。

## Español

Haz que tu buddy de Claude Code hable español.

```bash
npx buddy-i18n es                # por defecto
npx buddy-i18n restore           # restaurar original
```

Reinicia Claude Code después de ejecutar.

## Français

Faites parler votre buddy Claude Code en français.

```bash
npx buddy-i18n fr                # par défaut
npx buddy-i18n restore           # restaurer l'original
```

Redémarrez Claude Code après l'exécution.

## Deutsch

Lass deinen Claude Code Buddy Deutsch sprechen.

```bash
npx buddy-i18n de                # Standard
npx buddy-i18n restore           # Original wiederherstellen
```

Starte Claude Code nach der Ausführung neu.

## Português (Brasil)

Faça seu buddy do Claude Code falar português.

```bash
npx buddy-i18n pt-br             # padrão
npx buddy-i18n restore           # restaurar original
```

Reinicie o Claude Code após executar.

## How It Works

1. Reads your current companion from `~/.claude.json`
2. Detects your buddy's species automatically
3. Backs up the original personality (first time only)
4. Replaces `companion.personality` with the localized version
5. That's it — no binary patching, no hooks, just a JSON edit

## License

MIT
