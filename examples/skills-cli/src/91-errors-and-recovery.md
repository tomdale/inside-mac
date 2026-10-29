# Errors and Recovery {.appendix}

This appendix indexes the messages and surprising results of skills 1.7.4. A source or selection error writes nothing, while a per-agent failure leaves the other agents' installs in place. [`skills add`](#skills-add) says when a rerun is safe, and [Output streams and exit statuses](#output-streams-and-exit-statuses) lists exit statuses.

## Errors when adding skills

| Message or symptom | Cause | Recovery | See |
|---|---|---|---|
| `No valid skills found…`, often after `⚠ Skipped <path> — missing required frontmatter field(s): description` | No `SKILL.md` has string `name` and `description` fields. | Fix the files named, or point at the skills' directory. | [Contract](#the-skill-md-contract) |
| `No matching skills found for: <name>` | No skill has that `name`. `add` exits 1, and `remove` exits 0. | Use a listed name (case-insensitive). | [Selection](#selecting-skills-to-install) |
| `Invalid agents: <names>` | An `-a` value is not an agent ID. | Use an ID from `Valid agents:`. | [Targets](#how-the-cli-chooses-target-agents) |
| `Local path does not exist: <path>` | The path is wrong, or ends in `@skill`. | Fix the path, and name skills with `--skill`. | [Naming](#pinning-a-ref-and-naming-a-skill) |
| `Failed to clone repository` | Git failed; its error follows. | Fix the URL or credentials. | [Authentication](#network-access-authentication-and-telemetry) |
| `Interactive prompt required but stdin is not a TTY` | A prompt needed a terminal. Nothing was installed. | Pass `-a` and `-y`. | [Prompts](#non-interactive-mode-and-agent-detection) |
| `The --json flag requires --yes (or --all)…` | `--json` never prompts. | Add `-y`. | [`skills add`](#skills-add) |
| `<Agent> does not support global skill installation` | The agent is project-only. Other agents still install. | Install for it in project scope. | [Agents](#universal-and-agent-specific-agents) |
| `Symlinks failed for: <agents>` | Linking failed, so those agents got copies. | On Windows, enable Developer Mode and rerun. | [Modes](#symlink-mode-and-copy-mode) |

## Errors when updating or restoring

| Message or symptom | Cause | Recovery | See |
|---|---|---|---|
| `No project skills to update.`, or `N skill(s) cannot be checked automatically:` with `(Local path)` | `update` skips local-path and npm-synced skills. | Rerun the original `add` (shown after `To update:` for global skills), or `experimental_sync`. | [Updates](#how-updates-are-detected-and-applied) |
| `✗ Failed to update <skill>` | The hidden reinstall failed, as it does in 1.7.4 for subdirectory skills of a `file://` source not ending in `.git`. | Rerun `add` with the recorded source. | [Updates](#check-for-and-apply-updates) |
| `Cannot restore <skill>: skills-lock.json is missing sourceUrl…` | An older generic Git or GitLab entry lacks its URL, so the skill is skipped. | Rerun `add` with the full URL. | [Restore](#restore-skills-from-the-lock-file) |
| `Missing required argument: source` from `install` | `install` aliases `add`. | Run `experimental_install`. | [Restore](#restore-skills-from-the-lock-file) |

## Unexpected placement and removal results

| Message or symptom | Cause | Recovery | See |
|---|---|---|---|
| Every agent got the skill; `.claude/` and `agent/` appeared | `-y` without `-a` found no usable agent. | Remove it, and reinstall with `-a`. | [Targets](#how-the-cli-chooses-target-agents) |
| `skipped: <agents> (project directory not found)` | The agent's directory, such as `.windsurf/`, is absent. | Create it or use `-a`, then rerun `add`. | [Targets](#how-the-cli-chooses-target-agents) |
| The skill landed in a subdirectory | Project scope is the current directory. | Remove it, and rerun `add` from the project root. | [Scopes](#project-scope-and-global-scope) |
| `(copied)` without `--copy` | All targets share one directory. | None needed. | [Modes](#symlink-mode-and-copy-mode) |
| An installed copy no longer matches its source | Edits to the source, or to one copy, do not spread. | Rerun `add`, which discards local edits. | [`skills add`](#skills-add) |
| Dangling links after `remove -a` | No other detected agent had the skill, so the canonical copy was deleted. | Rerun `add` for the agents that need it. | [remove](#skills-remove) |
