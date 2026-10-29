# Files and Environment Variables {.appendix}

[About Scopes, Agents, and Lock Files](#about-scopes-agents-and-lock-files) explains the model behind these files.

## File locations

Paths without `~` are relative to the project directory, the current working directory.

| Path | Scope | Written by | Purpose |
|---|---|---|---|
| `.agents/skills/<name>/` | Project | `add`, `update`, `experimental_install`, `experimental_sync` | Canonical copy, read by universal agents |
| Agent-specific directories, such as `.claude/skills/` ([all agents](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)) | Project or global | `add`, `update`, `experimental_sync` | Link to the canonical copy, or an independent copy |
| `skills-lock.json` | Project | `add`, `remove`, `update`, `experimental_install`, `experimental_sync` | Project lock file; commit it |
| `~/.agents/skills/<name>/` | Global | `add -g`, `update -g` | Global canonical copy |
| `~/.agents/.skill-lock.json`, or `$XDG_STATE_HOME/skills/.skill-lock.json` when that variable is set | Global | `add -g`, `remove -g`, `update -g`; interactive `add` and `experimental_sync` in a project (remembered agent choices and dismissed prompts) | Global lock file |

## Project lock file fields

`skills-lock.json` maps each skill name to an entry with these fields:

- `source`: what to pass to `add` to reinstall.
- `sourceUrl`: the clone URL of a `git` or `gitlab` source. `experimental_install` cannot restore a generic Git entry without it.
- `sourceType`: how the skill is fetched. `update` never updates `local` or `node_modules` entries in place.
- `ref`: the pinned branch or tag, which update and restore fetch again.
- `skillPath`: the skill's `SKILL.md` within the source. `update` cannot update a remote entry without it.
- `computedHash`: SHA-256 of the source skill folder's file paths and contents. `update` compares it with the source, so edits to installed files go undetected.
- `version`: the package version that shipped a `node_modules` skill.
- `via`: the package whose `package.json` `skills` field requested the skill (`.` is the project). Sync removes the entry when the request goes away, so edit `package.json`, not the lock.

[`src/local-lock.ts`](https://github.com/vercel-labs/skills/blob/main/src/local-lock.ts) defines every field.

## Global lock file

The global lock (its path is in the last row of the table above) has `version` 3. The CLI treats a lock with a lower version as empty and replaces it at the next write, including one from an interactive project-scope `add`. Skills it listed stay installed, but `update -g` ignores them until you reinstall them with `add -g`.

Apart from well-known entries, `update -g` checks an entry only when it has both `skillFolderHash` and `skillPath`. It lists other entries, including every local one, as "cannot be checked automatically", with an `add` command to rerun. [`src/skill-lock.ts`](https://github.com/vercel-labs/skills/blob/main/src/skill-lock.ts) defines the remaining fields.

## Environment variables

| Variable | Effect | Default |
|---|---|---|
| `DISABLE_TELEMETRY` | Any non-empty value stops telemetry and audit requests ([details](#network-access-authentication-and-telemetry)) | Unset |
| `DO_NOT_TRACK` | Same as `DISABLE_TELEMETRY` | Unset |
| `INSTALL_INTERNAL_SKILLS` | `1` or `true` shows internal skills | Unset |
| `GITHUB_TOKEN` | Token for GitHub API requests that fail anonymously | Unset |
| `GH_TOKEN` | Used when `GITHUB_TOKEN` is unset | Unset |
| `GH_HOST` | GitHub Enterprise host for shorthand sources, cloned as `git` | `github.com` |
| `XDG_STATE_HOME` | Moves the global lock | Unset |
| `XDG_CONFIG_HOME` | Base of some agents' global directories, such as Goose's | `~/.config` |
| `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, and [other agent homes](https://github.com/vercel-labs/skills/blob/main/src/agents.ts) | Moves an agent's home, used for detection and as the parent of an agent-specific global `skills/` | `~/.claude`, `~/.codex`, … |
| `SKILLS_DOWNLOAD_MAX_BYTES` | Largest direct download | 10 MiB |
| `SKILLS_EXTRACT_MAX_BYTES` | Largest total extracted size | 25 MiB |
| `SKILLS_EXTRACT_MAX_FILES` | Most files in an archive | 1000 |
| `SKILLS_CLONE_TIMEOUT_MS` | Git clone time limit | 300000 (5 minutes) |
| `SKILLS_API_URL` | Search API base for `find` | `https://skills.sh` |

Agent-detection variables are covered in [Non-interactive mode and agent detection](#non-interactive-mode-and-agent-detection).
