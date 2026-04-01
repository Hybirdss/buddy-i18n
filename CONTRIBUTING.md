# Contributing to buddy-i18n

Thank you for helping make Claude Code buddies speak more languages!

## Species Traits

When writing personalities, each species should express these core traits:

| Species | Trait | Vibe |
|---------|-------|------|
| duck | Cheerful | Celebrates wins, judges variable names |
| goose | Chaotic | Thrives on merge conflicts, honks at TODOs |
| blob | Chill | Absorbs stress, unhurried wisdom |
| cat | Aloof | Pretends not to care, secretly fixes bugs |
| dragon | Fierce guardian | Burns spaghetti code, hoards good functions |
| octopus | Multitasker | Juggles concerns, unsolicited architecture advice |
| owl | Nocturnal sage | Late-night debugging, insightful questions |
| penguin | Dignified | Professional, dry wit |
| turtle | Patient | Slow and steady, refactoring > rewrites |
| snail | Zen minimalist | Own pace, thoughtful observations |
| ghost | Haunting | Haunts dead code, whispers about old bugs |
| axolotl | Regenerative optimist | Every build can be healed |
| capybara | Relaxed | Nothing fazes them, not even 3am outages |
| cactus | Prickly but lovable | Thrives on neglect, sharp feedback |
| robot | Logical | Precise observations, endearing glitches |
| rabbit | Hyperactive | Speed-reads diffs, bounces between topics |
| mushroom | Wry tangential | Meandering tangents, secretly enjoys chaos |
| chonk | Maximum gravitational presence | Heavy, minimal urgency |

## Guidelines

### Personality Text

- **1-2 sentences** — the buddy's speech bubble is small
- **Natural language** — write as a native speaker, not a translator
- **End with a language note** — e.g., "Always speaks in short Korean quips"
- **Keep the character** — a dragon should feel different from a capybara

### What Makes a Good Translation

```
❌ "A cheerful quacker who celebrates your wins. Always speaks Korean."
   (Machine-translated feeling, not natural)

✅ "코딩 성공엔 꽥꽥 환호하고, 변수명엔 조용히 눈을 흘기는 명랑한 오리. 한국어로 짧게 한마디."
   (Natural Korean, captures the duck's personality)
```

## Adding a New Language

1. Fork this repo
2. Create `locales/<lang-code>/meta.json` and `locales/<lang-code>/default.json`
3. Submit a PR with title: `feat: add <Language> locale`

Use [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag): `ko`, `ja`, `zh-cn`, `pt-br`, etc.

## Adding a Style

Styles are alternate personality packs. Examples: `tsundere`, `mentor`, `formal`, `pirate`.

1. Create `locales/<lang-code>/<style-name>.json`
2. Follow the same format as `default.json`
3. Submit a PR with title: `feat: add <style> style for <Language>`

## Review Process

- Native speaker review is required for all new languages
- We'll tag community reviewers in your PR
- Style packs need at least 2 approvals

## Code Changes

For CLI or library changes:

```bash
git clone https://github.com/narukoshin/buddy-i18n
cd buddy-i18n
npm install
node bin/cli.mjs list    # test locally
```
