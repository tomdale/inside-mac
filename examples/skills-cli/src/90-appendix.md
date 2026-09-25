# Glossary {.appendix}

**agent** — A coding tool (Claude Code, Codex, Cursor, and more than
seventy others) that reads installed skills from its own configured
directory. See [Chapter 4](#agent-targets).

**canonical copy** — The one on-disk copy of a skill's files the CLI
maintains per scope, at `.agents/skills/<name>` (project) or
`~/.agents/skills/<name>` (global). In symlink mode, every other install
location either is this copy (universal agents) or points back to it
(agent-specific agents). Compare **agent-specific copy**.

**agent-specific copy** — A skill's files written directly into one agent's
own configured directory, either because install mode was `copy`, or
because a relative symlink to the canonical copy could not be created and
the CLI fell back to a real copy for that agent.

**frontmatter** — The YAML block at the top of `SKILL.md`, delimited by
`---` lines, that carries `name`, `description`, and optional fields. See
[Chapter 2](#skill-packages).

**global scope** — Installing into the user's home directory
(`~/.agents/skills`, or an agent's own global directory) with `-g`/
`--global`, available to every project on the machine. Compare **project
scope**.

**internal skill** — A skill whose frontmatter sets
`metadata.internal: true`, excluded from ordinary discovery but still
installable by exact name or with `INSTALL_INTERNAL_SKILLS=1`. See
[Chapter 2](#skill-packages).

**lock file** — A JSON file recording which skills are installed and from
where, so `update` and `remove` can find them again. There are two: the
project-scoped `skills-lock.json` and the global
`~/.agents/.skill-lock.json`. See Appendix B.

**project scope** — Installing into the current project directory (the
default), tracked in a `skills-lock.json` meant to be committed alongside
the project. Compare **global scope**.

**skill** — A directory containing a `SKILL.md` file with valid `name` and
`description` frontmatter, plus any supporting files its instructions
reference. See [Chapter 1](#introduction-to-agent-skills).

**source** — Whatever you name to `skills add`, `skills use`, or `skills
find`: GitHub shorthand, a full Git/GitLab/Azure Repos URL, a bare Git URL,
a local path, or an HTTP(S) URL resolved as well-known or direct-download.
See [Chapter 2](#skill-packages).

**universal agent** — An agent whose configured project `skillsDir` is
exactly `.agents/skills`, so it reads the canonical copy directly with no
symlink of its own. See [Chapter 4](#agent-targets).

**well-known source** — An HTTP(S) URL that is not a recognized Git host,
resolved by checking `/.well-known/agent-skills/index.json` (or the legacy
`/.well-known/skills/index.json`) at that URL's origin before falling back
to a direct download. See [Chapter 2](#skill-packages).

# File Formats {.appendix}

## The Project Lock File: `skills-lock.json`

Written at the project root by `add` (project scope), `experimental_sync`,
and `experimental_install`; read by `update`, `list`, `remove`, and
discovery itself (to avoid re-discovering an already-installed project
skill as though it were a source skill — Chapter 2). Meant to be committed
to version control: it deliberately omits timestamps so that two branches
adding different skills merge cleanly as plain JSON, and its skill entries
are always written sorted alphabetically by name for a stable diff.

```json
{
  "version": 1,
  "skills": {
    "web-design-guidelines": {
      "source": "vercel-labs/agent-skills",
      "sourceUrl": "https://github.com/vercel-labs/agent-skills.git",
      "sourceType": "github",
      "skillPath": "skills/web-design-guidelines/SKILL.md",
      "computedHash": "9f2b1c...(sha-256 over every file in the skill folder)",
      "ref": null
    }
  }
}
```

| Field | Meaning |
|---|---|
| `version` | Schema version; `1` in this release. An older-versioned file is treated as empty rather than migrated. |
| `source` | The original source string, or its normalized `owner/repo` form for public GitHub sources |
| `sourceUrl` | The resolved clone/fetch URL, present when it differs meaningfully from `source` (generic Git and GitLab sources) |
| `sourceType` | One of `github`, `gitlab`, `git`, `local`, `well-known`, `node_modules` |
| `ref` | A pinned branch, tag, or commit SHA, if the source specified one |
| `skillPath` | The skill's `SKILL.md` path relative to the source root; required for `update` to reinstall only this skill rather than the whole source |
| `computedHash` | SHA-256 over the sorted relative paths and contents of every file in the installed skill folder |
| `subagents` | For Eve installs, which subagent directories (or the root agent, recorded as `""`) received this skill |
| `wellKnownDigest` | For well-known sources, a digest used to detect upstream changes without a full content re-fetch |

## The Global Lock File: `~/.agents/.skill-lock.json`

Written by global-scope `add`, and read by global `update`, `list`, and
`remove`. Its path honors `$XDG_STATE_HOME/skills/.skill-lock.json` when
that variable is set, falling back to `~/.agents/.skill-lock.json`
otherwise. Unlike the project lock file, it does track install and update
timestamps, since it is per-machine state, never committed anywhere.

```json
{
  "version": 3,
  "skills": {
    "web-design-guidelines": {
      "source": "vercel-labs/agent-skills",
      "sourceType": "github",
      "sourceUrl": "https://github.com/vercel-labs/agent-skills.git",
      "skillPath": "skills/web-design-guidelines/SKILL.md",
      "skillFolderHash": "a1b2c3...(GitHub tree SHA for the skill folder)",
      "installedAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  },
  "dismissed": {},
  "lastSelectedAgents": ["claude-code", "cursor"]
}
```

| Field | Meaning |
|---|---|
| `version` | Schema version; `3` in this release. A file at an older version is wiped and rebuilt on next write rather than migrated in place — a deliberately breaking change made when folder-hash tracking was added. |
| `skillFolderHash` | For GitHub sources, the folder's Git tree SHA, fetched via the Trees API; changes whenever any file under the skill's folder changes upstream |
| `installedAt` / `updatedAt` | ISO timestamps; `installedAt` is preserved across updates, `updatedAt` refreshes on every successful `add`/`update` |
| `lastSelectedAgents` | The most recent interactive agent selection, reused to pre-populate the next prompt |
| `dismissed` | Tracks one-time prompts (currently, whether a `find-skills` follow-up suggestion was dismissed) so they are not repeated |

Both lock files use the same skill-name-to-entry shape, and both are best
treated as CLI-managed state: hand-editing either is possible (they are
plain JSON) but unnecessary for any workflow this guide describes.

# Known Gaps and Open Questions {.appendix}

This guide was written directly against the `skills` v1.7.0 source, its
tests, and real command output captured from that exact commit. A few areas
are intentionally underspecified here, either because they are explicitly
labeled experimental upstream or because full verification was out of this
guide's scope:

- **Notion sources.** `skills add` recognizes and routes Notion workspace
  and page URLs through a dedicated integration, separate from the
  Git/HTTP resolver this guide specifies in full (Chapter 2). This guide
  confirms the source type is recognized but does not specify its
  authentication or pack-selection behavior in the same depth as every
  other source format. **Marked Inferred in Chapter 2.**
- **`experimental_install` and `experimental_sync` stability.** Both
  commands are named `experimental_*` by the CLI itself and are documented
  here as they behave in v1.7.0; their contract is more likely to change in
  a future release than the stable `add`/`remove`/`update`/`list` commands.
- **The `skills.sh` discovery index.** `find` and the security-audit
  annotations shown during `add` both call a hosted API
  (`https://skills.sh`, `https://add-skill.vercel.sh`) whose own behavior,
  ranking, and data freshness are outside this guide's scope — this guide
  documents only the CLI's client-side request and response handling, not
  the service behind it.
- **Detection heuristics inside `@vercel/detect-agent`.** Chapter 3's
  non-interactive detection relies on an external package whose exact
  per-agent environment-variable signals were not individually audited
  here, beyond the one documented override this CLI applies on top of it
  (requiring a stronger signal before treating a Cursor terminal session as
  an active agent run, to avoid false positives in an interactive Cursor
  terminal).

None of these gaps affect the accuracy of the command reference in
Chapter 6, which was checked against the source and, for every command
shown with a transcript, against real output.
</content>
