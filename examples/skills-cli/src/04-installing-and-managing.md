# Installing and Managing Skills

This chapter's sections share one sandbox and build on each other, so run them in order the first time. Read Chapter 3 first if you share a machine or repository with other agents, because its model explains where each command writes and why a removal can reach agents you did not name.

## Before you begin

- Node.js 22.20.0 or later.
- Git on your `PATH`.
- The sandbox, created in [The sample setup](#the-sample-setup).
- A terminal that is not running inside a coding agent, because inside one the CLI can choose other targets ([Non-interactive mode and agent detection](#non-interactive-mode-and-agent-detection)).
- Recommended: [About Scopes, Agents, and Lock Files](#about-scopes-agents-and-lock-files).

## In this chapter you will

- install, list, update, and remove skills in a project and in your home directory;
- give an installed skill to another agent;
- try a skill without installing it.

## The sample setup

The book's examples run in a sandbox at `/tmp/demo`. Its `home/` directory replaces your home directory for the session, so global installs and Git settings stay out of your real one. Open a new shell, delete any `/tmp/demo` left from an earlier run, and run:

```sh
mkdir -p /tmp/demo/home /tmp/demo/project
export HOME=/tmp/demo/home DISABLE_TELEMETRY=1
git config --global user.name "Acme Docs"
git config --global user.email docs@acme.example
cd /tmp/demo
mkdir -p acme-skills/skills/release-notes acme-skills/skills/changelog-lint
cat > acme-skills/skills/release-notes/SKILL.md <<'EOF'
---
name: release-notes
description: Draft release notes from merged pull requests. Use when preparing a release or a changelog entry.
---

# Release notes

1. List the pull requests merged since the last release tag.
2. Group them under the headings in template.md.
3. Write one plain sentence per change, naming the user-visible effect.
EOF
printf '## Added\n## Changed\n## Fixed\n' > acme-skills/skills/release-notes/template.md
cat > acme-skills/skills/changelog-lint/SKILL.md <<'EOF'
---
name: changelog-lint
description: Check CHANGELOG.md entries for format problems. Use before tagging a release.
---

# Changelog lint

Report entries that lack a version heading, a date, or a category.
EOF
git -C acme-skills init -q
git -C acme-skills add .
git -C acme-skills commit -q -m "Add release-notes and changelog-lint"
git clone -q --bare acme-skills acme-skills.git
cd project
```

The listing creates `acme-skills`, a local source with two skills, and `acme-skills.git`, a bare Git copy for the update examples, and leaves the shell in `project/`. Close the shell when you finish, so that later commands use your real home directory.

## Install a skill into a project

The Acme team uses Claude Code and Codex. Create both home directories so that the CLI detects both agents; later sections use Codex detection when listing and removing. Install for Claude Code first with [`npx skills add`](#skills-add), the command that [A first skill, end to end](#a-first-skill-end-to-end) runs with its full output:

```sh
mkdir -p ~/.claude ~/.codex
npx skills add ../acme-skills --skill release-notes -a claude-code -y
```

The result reports `release-notes (copied)`, because one target directory means [copy mode](#symlink-mode-and-copy-mode). Verify what the command wrote:

```sh
ls .claude/skills/release-notes
cat skills-lock.json
```

```text
SKILL.md
template.md
{
  "version": 1,
  "skills": {
    "release-notes": {
      "source": "../acme-skills",
      "sourceType": "local",
      "computedHash": "807f3bbaa62d61c70f82fda6205bb7f4cba55591e7748a8f2137377e2a6b504d"
    }
  }
}
```

The project lock file records the source relative to the project and a hash of the skill's files ([Lock files](#lock-files)).

> [!WARNING]
> Read a skill's `SKILL.md` and supporting files before you install it. The CLI does not check what they say, and an agent that loads the skill follows its instructions with the agent's own permissions, which can include running commands and editing files ([What the skills CLI does](#what-the-skills-cli-does)).

Install failures are listed in [Errors when adding skills](#errors-when-adding-skills).

## List installed skills

[`npx skills list`](#skills-list) shows the project's skills:

```text
Project Skills
release-notes ./.claude/skills/release-notes
  Agents: Claude Code  Source: /tmp/demo/acme-skills
```

The CLI builds the `Agents:` line from the files on disk, because the lock file does not record agents. It checks the skills directory of each agent detected on this machine, and of each agent whose directory exists in the project, and lists an agent only when the skill is there. Codex is detected but not listed, because the skill is not yet in `.agents/skills`, where Codex reads. `-g` lists global skills instead; [`skills list`](#skills-list) describes `-a` and `--json`.

## Install a skill for all your projects

Add `-g` to install under your home directory, where every project on the machine sees the skill:

```sh
npx skills add ../acme-skills --skill changelog-lint -g -a claude-code codex -y
```

With two target directories, the CLI uses symlink mode, and the result block reports `universal: Codex` and `symlinked: Claude Code`. The real copy is `~/.agents/skills/changelog-lint`, where Codex reads it, and `~/.claude/skills/changelog-lint` is a link to it. The install is recorded in the [global lock file](#global-lock-file), not the project's.

Without `-a`, project-only agents report a per-agent failure ([Universal and agent-specific agents](#universal-and-agent-specific-agents)).

## Add an agent to an installed skill

To give an installed skill to another agent, run `add` again and list every agent that should have it, including those that already do:

```sh
npx skills add ../acme-skills --skill release-notes -a claude-code codex -y
```

The installation summary's `overwrites: Claude Code` line names targets whose files the CLI replaces. With two target directories, the CLI writes the real copy to `.agents/skills`, where Codex reads, and replaces Claude Code's copy with a link to it. Running with only `-a codex` would target one directory, `.agents/skills`, so the CLI would copy the files there and leave Claude Code's separate copy in place. The two copies would then drift apart.

## Check for and apply updates

[`npx skills update`](#skills-update-and-skills-check) reinstalls skills whose source has changed. `-p` limits it to the project, and `-y` suppresses prompts. Run `npx skills update -p -y`. Because `release-notes` came from a local path, which `update` never checks, the command reports `No project skills to update.` Reinstall `release-notes` from the Git repository, and run `update` again:

```sh
npx skills add file:///tmp/demo/acme-skills.git --skill release-notes -a claude-code codex -y
npx skills update -p -y
```

The update now ends with `✓ All project skills are up to date`.

Publish a change from a working clone, then update:

```sh
cd /tmp/demo
git clone -q acme-skills.git acme-work
echo "4. Link each entry to its pull request." >> acme-work/skills/release-notes/SKILL.md
git -C acme-work commit -q -am "Link entries to pull requests"
git -C acme-work push -q
cd project
npx skills update -p -y
tail -n 1 .claude/skills/release-notes/SKILL.md
```

```text
Checking for skill updates…
Updating for: Universal, Claude Code
Checking 1 skill(s)…
Updating release-notes…
  ✓ Updated release-notes
✓ Updated 1 skill(s)
4. Link each entry to its pull request.
```

The update reinstalls for the agents detected now, not those you named with `-a` ([How updates are detected and applied](#how-updates-are-detected-and-applied)).

> [!IMPORTANT]
> In skills 1.7.4, `npx skills check` is an alias of `update`: it installs the changes it finds. Do not run `check` where you want only a report, such as a CI job that must not change files ([`skills update` and `skills check`](#skills-update-and-skills-check)).

Update failures are listed in [Errors when updating or restoring](#errors-when-updating-or-restoring).

## Remove skills

[`npx skills remove`](#skills-remove) deletes skills from the project, or from the home directory with `-g`. Pass `-a` to remove a skill from one agent:

```sh
npx skills remove release-notes -a claude-code -y
```

Then run `npx skills list`:

```text
Project Skills
release-notes ./.agents/skills/release-notes
  Agents: Codex  Source: file:///tmp/demo/acme-skills.git
```

The CLI deleted Claude Code's link but kept the canonical copy and its lock entry, because Codex, a detected agent, still reads the copy.

> [!WARNING]
> Removing a skill from one agent also deletes the canonical copy in `.agents/skills` and the skill's lock entry unless another agent detected on this machine still has the skill. Links from agents the CLI does not detect are left pointing at nothing, and those agents lose the skill. Run `npx skills list` after removing from one agent, and rerun `add` for the agents that still need the skill ([`skills remove`](#skills-remove)).

A universal agent reads the canonical copy directly, so `-a` cannot remove a skill from one universal agent while other agents still use it: with Claude Code also installed, `remove release-notes -a codex -y` reports success but leaves the copy and its lock entry in place. To keep a skill for Claude Code only, remove it from every agent, then reinstall with `-a claude-code`, which copies it into `.claude/skills`:

```sh
npx skills remove release-notes -y
npx skills add file:///tmp/demo/acme-skills.git --skill release-notes -a claude-code -y
```

Without `-a`, as in the first command, `remove` deletes the skill from every agent directory, along with the canonical copy and the lock entry. `--all` removes every skill in the chosen scope and implies `-y`, as in `npx skills remove --all -g`.

Removing a name that matches no installed skill prints `No matching skills found for: <name>` and exits 0, so a script cannot detect a mistyped name from the exit status. For other surprises, see [Unexpected placement and removal results](#unexpected-placement-and-removal-results).

## Try a skill without installing it

[`npx skills use`](#skills-use) prints a prompt that tells an agent to follow one skill, without installing it:

```sh
npx skills use ../acme-skills --skill release-notes
```

The prompt is the only output on stdout and contains the whole `SKILL.md`. For a skill with supporting files, the prompt names a new directory under the system temporary directory that holds those files. The CLI leaves that directory in place after it exits, so delete it when you are done. `--agent` starts an agent with the prompt instead; in 1.7.4 it accepts only `claude-code`, `codex`, and `sarvam-code`.
