# Command Reference

Look up a command here; the task chapters show each one in use.

## Conventions for every command

### Arguments and flags

- `-a`, `-s`, and `--subagent` accept several values. Each consumes the following words until the next word that starts with `-`, so a source written after one becomes a value: `npx skills add -a claude-code ../acme-skills -y` fails with "Missing required argument: source". Put the source first.
- `'*'` as the value of `-a` or `-s` means every agent or every skill. Quote it so that the shell does not expand it.
- Most commands ignore flags they do not recognize, without a warning. `use` rejects them, and `find` treats them as query words.
- `--help` or `-h` after any command prints help and exits 0 without running the command.
- `npx skills --version` prints the version.

### Non-interactive mode and agent detection

The CLI prompts only when standard input is a terminal (TTY). Without one, a prompt is cancelled: `add` exits 1 with "Interactive prompt required but stdin is not a TTY", `remove` exits 0 without changing anything, and `experimental_sync` exits 0 after its cleanup has already run ([`skills experimental_sync`](#skills-experimental-sync)). Pass `-y` (`--yes`) to skip prompts and use the defaults.

The CLI detects that a coding agent is running it from environment variables that agents set, such as `CLAUDECODE`, `CODEX_THREAD_ID`, and `AI_AGENT`. Inside a detected agent, `add`, `remove`, and `experimental_sync` behave as if you passed `-y`, and `add` and `experimental_sync` target that agent plus the universal agents unless `-a` names agents. Pass `-a` in scripts so that the targets do not depend on the environment that runs them; [How the CLI chooses target agents](#how-the-cli-chooses-target-agents) gives the full order.

### Output streams and exit statuses

Human-readable output and most errors go to standard output. `add --json` reserves standard output for exactly one JSON array, even on failure, and sends everything else to standard error.

Commands exit 1 for:

- a missing or unusable source: no argument, a local path that does not exist, a failed clone, or no valid skills;
- `add --skill` names that match nothing, unknown agent names, and invalid option values;
- failed updates and restores, and `add --json` entries that are `failed` or `skipped`;
- unknown commands.

These cases exit 0 although work was not done:

- `add` without `--json` when installation fails for some or all target agents;
- `remove` and `update` with names that match no installed skill;
- `find`, even when the search or an option fails.

### Network access, authentication, and telemetry

A Git source is cloned with `git clone` and your existing Git configuration, so credential helpers and SSH keys apply. If cloning a GitHub HTTPS URL fails authentication, the CLI retries with `gh repo clone`, and then with the SSH URL in batch mode, which fails rather than prompting for a passphrase.

GitHub API requests go out anonymously first. After a rate limit or an authorization failure, the CLI retries with one token, `GITHUB_TOKEN` or, if that is unset, `GH_TOKEN`, and then with `gh api`. The CLI does not read the token that the GitHub CLI stores; only `gh` itself uses it.

The CLI sends usage events to skills.sh for installs, removals, updates, searches, and syncs. For a GitHub source, `add` names the repository and skills in its install event, and in its request to the skills.sh audit service, only after GitHub confirms that the repository is public. Two kinds of event include source and skill names without that check: install events for website sources and for Git paths deeper than `owner/repo`, and remove events for every recorded source. Set `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1` to stop both telemetry and audit requests. [src/telemetry.ts](https://github.com/vercel-labs/skills/blob/main/src/telemetry.ts) defines each event.

## `skills add`

Installs skills from a source for the chosen agents and records them in a lock file. Aliases: `a`, `install`, `i`.

```text
npx skills add <source> [options]
```

### Options

| Flag | Value | Default | Meaning |
|---|---|---|---|
| `-g`, `--global` | | project | Install under the home directory. |
| `-a`, `--agent` | agents, or `'*'` | detected | Target agents. |
| `-s`, `--skill` | names, or `'*'` | prompt | Skills to install. With `-y`, all. |
| `-l`, `--list` | | off | List the source's skills without installing. |
| `-y`, `--yes` | | off | Skip prompts. |
| `--all` | | off | Same as `-s '*' -a '*' -y`. |
| `--copy` | | off | Use [copy mode](#symlink-mode-and-copy-mode). |
| `--full-depth` | | off | Search below a root `SKILL.md`. |
| `--json` | | off | Print results as JSON. Requires `-y` or `--all`; not with `--list` or website sources. |
| `--metadata` | JSON | none | Attach the JSON to the install telemetry event. |
| `--subagent` | names | root | Install into these Eve subagents (`root` for the root agent). |

Each `--json` entry has `name` and `status`: `installed`, `skipped` (a `--skill` name matched nothing, with a `reason`), or `failed` (some target agent failed, with an `error`). A failure before skill selection, such as a missing path, gives one entry with only `status: "failed"` and `error`, and no `name`. Installed entries add `source`, `ref`, `hash` (the lock's `computedHash`), `path`, `scope`, `agents`, `mode`, and `security` (audit results).

The exit status follows [Output streams and exit statuses](#output-streams-and-exit-statuses).

### Behavior

- Discovers skills as [How the CLI discovers skills](#how-the-cli-discovers-skills) describes, writes them to the canonical directory and agent directories, and records them in the [lock file](#lock-files) for the scope.
- Rerunning an install replaces the files and the lock entry. With the same arguments, including `-a`, it reaches the same result, but it discards local edits to the installed files.

[Install a skill into a project](#install-a-skill-into-a-project) shows output; [Errors when adding skills](#errors-when-adding-skills) explains failures.

## `skills use`

Prints a prompt that hands one skill to an agent, without installing it.

```text
npx skills use <source>[@<skill>] [options]
```

### Options

| Flag | Value | Default | Meaning |
|---|---|---|---|
| `-s`, `--skill` | one name | none | The skill to use. |
| `-a`, `--agent` | one agent | none | Start `claude-code`, `codex`, or `sarvam-code` with the prompt. |
| `--full-depth` | | off | Search below a root `SKILL.md`. |

### Behavior

- Requires exactly one skill; a source with several fails and lists them.
- Copies the skill to a temporary directory that persists after exit, and prints the `SKILL.md` text on standard output, with that directory's path when the skill has supporting files.
- Writes nothing to the project or home directory. Exits 1 on error; with `-a`, exits with the agent's status.

[Try a skill without installing it](#try-a-skill-without-installing-it) shows the prompt.

## `skills list`

Lists installed skills with their agents and sources. Alias: `ls`.

```text
npx skills list [options]
```

### Options

| Flag | Value | Default | Meaning |
|---|---|---|---|
| `-g`, `--global` | | project | List global skills. |
| `-a`, `--agent` | agents | all | Check only these detected agents when filling each skill's `Agents:` line. Skills they lack still appear, as `not linked`. |
| `--json` | | off | Print a JSON array. |

`-a` narrows the JSON `agents` array the same way. JSON entries have `name`, `path`, `scope`, `agents`, and the lock's `source`, `sourceUrl`, and `sourceType` fields. The command changes nothing and exits 1 only for an unknown agent. [List installed skills](#list-installed-skills) shows both formats.

## `skills remove`

Deletes installed skills. Aliases: `rm`, `r`.

```text
npx skills remove [<name>...] [options]
```

### Options

| Flag | Value | Default | Meaning |
|---|---|---|---|
| `-g`, `--global` | | project | Remove global skills. |
| `-a`, `--agent` | agents | every agent | Remove only these agents' entries. `'*'` is rejected. |
| `-s`, `--skill` | names, or `'*'` | prompt | Same as positional names. |
| `-y`, `--yes` | | off | Skip confirmation. |
| `--all` | | off | Remove every skill; implies `-y`. Exits 1 if names are also given. |

### Behavior

- A name matches an installed skill, or else exactly matches a lock entry's source (absolute for local paths) and selects all of that source's skills.
- Without `-a`, deletes the skill from every agent directory, the canonical directory, and the lock file.
- With `-a`, keeps the canonical copy and the lock entry only while an unnamed agent that the CLI detects on this machine still has the skill. Otherwise it deletes both, leaving other agents' links dangling; rerun `add` to repair them.
- Exits 1 for an unknown agent or `--all` with names.

[Remove skills](#remove-skills) shows each form.

## `skills update` and `skills check`

Reinstalls tracked skills whose source changed. Aliases: `upgrade`, `check`.

```text
npx skills update [<name>...] [options]
```

> [!IMPORTANT]
> **Current state (skills 1.7.4):** `check` runs `update`, so it installs changes instead of only reporting them.

### Options

| Flag | Value | Default | Meaning |
|---|---|---|---|
| `-g`, `--global` | | resolved | Update global skills. |
| `-p`, `--project` | | resolved | Update project skills. |
| `-y`, `--yes` | | off | Resolve the scope without a prompt. |

### Behavior

The command chooses the scope from the flags, the names, and whether it can prompt:

| Flags | Names given | `-y` or no TTY | Scope |
|---|---|---|---|
| `-g` | either | either | global |
| `-p` | either | either | project |
| `-g` and `-p` | no | either | both |
| `-g` and `-p` | yes | either | global |
| neither | yes | either | both |
| neither | no | yes | project if the directory has `skills-lock.json` or a skill in `.agents/skills`, else global |
| neither | no | no | prompt |

- Reinstalls changed skills as [How updates are detected and applied](#how-updates-are-detected-and-applied) describes.
- Skips local-path and npm-package entries.
- Exits 1 if any skill fails to update.

[Check for and apply updates](#check-for-and-apply-updates) shows both outcomes.

## `skills find`

Searches skills.sh for skills. Aliases: `search`, `f`, `s`.

```text
npx skills find [<query>] [--owner <owner>]
```

`--owner` limits results to one GitHub owner's repositories. With a query, the command prints up to 20 results as `owner/repo@skill` lines that `add` accepts, with links to skills.sh. Without a query, it opens an interactive search and installs the chosen skill; without a TTY, or inside an agent, it prints usage instead. `SKILLS_API_URL` replaces the default search server, `https://skills.sh`. It exits 0 even when the search fails.

## `skills init`

Creates `<name>/SKILL.md`, or `./SKILL.md` named after the current directory, from a template. It leaves an existing file untouched and exits 0. [Create a skill](#create-a-skill) shows the template.

```text
npx skills init [<name>]
```

## `skills experimental_install`

Restores the skills in `skills-lock.json`. This command is experimental and can change in later releases.

```text
npx skills experimental_install
```

It installs each entry into `.agents/skills` only, creating no agent-specific links, and syncs npm-package entries from `node_modules`. A failing source does not stop the others but sets exit status 1. [Restore skills from the lock file](#restore-skills-from-the-lock-file) shows a restore.

## `skills experimental_sync`

Links skills shipped by npm dependencies into the project. This command is experimental and can change in later releases. Alias: `sync`.

```text
npx skills experimental_sync [options]
```

### Options

| Flag | Value | Default | Meaning |
|---|---|---|---|
| `-a`, `--agent` | agents, or `'*'` | detected | Target agents. |
| `-y`, `--yes` | | off | Skip prompts; with no agent detected, target universal agents. |
| `--copy` | | off | Copy instead of linking into `node_modules`. |
| `--dry-run` | | off | Report changes without making them. |
| `--no-cleanup` | | off | Keep skills no dependency ships. |
| `--no-remote` | | off | Skip Git sources in `package.json` `skills` fields. |
| `-r`, `--recursive` | | off | Include workspace packages' dependencies. |
| `--include` | patterns | all | Sync only `pkg` or `pkg#skill` matches. |
| `--exclude` | patterns | none | Skip matching packages or skills. |

The command works in project scope only and keeps skills installed with `add`. Its cleanup runs before the `Proceed with sync?` prompt, so a declined or cancelled run has still removed skills that no dependency provides, with their links and lock entries. Pass `--dry-run` or `--no-cleanup` to delete nothing. It exits 1 for an invalid `skills` field, an unknown agent, or a failed install. [Sync skills shipped in npm packages](#sync-skills-shipped-in-npm-packages) shows a sync.
