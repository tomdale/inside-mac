# Glossary {.appendix}

**[agent](#universal-and-agent-specific-agents)**: a coding tool, such as Claude Code or Codex, that reads installed skills. Compare *target agent*.

**[agent-specific agent](#universal-and-agent-specific-agents)**: an agent with its own skills directory, such as `.claude/skills`, which receives a link or a copy. Compare *universal agent*.

**[canonical directory](#the-canonical-skills-directory)**: `.agents/skills`, or `~/.agents/skills` globally, holding each skill's one real copy in symlink mode.

**[computed hash](#lock-files)**: the project lock's SHA-256 hash of a skill folder's contents. Compare *skill folder hash*.

**[copy mode](#symlink-mode-and-copy-mode)**: placement giving each target agent its own copy, chosen by `--copy` or when all targets share one directory. Compare *symlink mode*.

**[direct download](#publish-from-a-website)**: a source that is one `SKILL.md` or archive at a URL. The project lock omits it, so it cannot be updated or restored.

**[discovery](#how-the-cli-discovers-skills)**: the search for skills inside a source. A `SKILL.md` at the search root ends it unless you pass `--full-depth`.

**[frontmatter](#the-skill-md-contract)**: the YAML block that opens `SKILL.md`. A skill lacking string `name` and `description` fields is skipped with a warning.

**[global lock file](#lock-files)**: `~/.agents/.skill-lock.json` by default, recording `-g` installs. Compare *project lock file*.

**[global scope](#project-scope-and-global-scope)**: installation under the home directory with `-g`. Compare *project scope*.

**[install directory](#skill-names-and-install-directories)**: the directory a skill installs into, named after its sanitized frontmatter `name`. Same-named skills share one, so the later install overwrites the earlier. Compare *skill name*.

**[internal skill](#selecting-skills-to-install)**: a skill marked `metadata.internal: true`, hidden unless you name it.

**[packaged skill](#sync-skills-shipped-in-npm-packages)**: a skill shipped in an npm package and linked from `node_modules` by sync, so it changes with the package.

**[plugin manifest](#how-the-cli-discovers-skills)**: `.claude-plugin/marketplace.json` or `plugin.json`, whose declared skill directories discovery also searches.

**[project lock file](#lock-files)**: `skills-lock.json`, which records project installs for restores and updates. Commit it.

**[project scope](#project-scope-and-global-scope)**: the default scope, rooted at the current directory, not the repository root.

**[ref](#pinning-a-ref-and-naming-a-skill)**: a Git branch or tag, given with `#ref` or a tree URL, that updates and restores fetch again.

**[skill](#what-a-skill-is)**: a directory containing `SKILL.md` and any supporting files, installed whole so relative references still resolve.

**[skill folder hash](#global-lock-file)**: the global lock's `skillFolderHash`, a GitHub tree SHA for GitHub sources. `update -g` checks only entries that have one. Compare *computed hash*.

**[skill name](#skill-names-and-install-directories)**: the frontmatter `name`, which `--skill` matches. Compare *install directory*.

**[skill pack](#declare-skills-in-package-json)**: a package whose `package.json` `skills` field declares skills for sync. Compare *packaged skill*.

**[SKILL.md](#the-skill-md-contract)**: the file that makes a directory a skill: frontmatter, then instructions.

**[source](#source-formats)**: the `add` or `use` argument naming where skills live: a local path, repository, or URL.

**[source type](#source-formats)**: the kind of source recorded in `sourceType`, such as `local` or `github`. It controls fetching and whether `update` checks it.

**[supporting files](#what-a-skill-is)**: files beside `SKILL.md`, referenced by relative path, that install with the skill.

**[symlink mode](#symlink-mode-and-copy-mode)**: the default placement: one real copy in the canonical directory, linked from each agent-specific directory, so an edit reaches every linked agent.

**[sync](#sync-skills-shipped-in-npm-packages)**: `experimental_sync`, which installs skills that npm dependencies ship or declare and removes stale ones.

**[target agent](#how-the-cli-chooses-target-agents)**: an agent receiving a skill in one install. Without `-a`, detection chooses, so pass `-a` in scripts.

**[universal agent](#universal-and-agent-specific-agents)**: an agent that reads `.agents/skills` directly, so it needs no link.

**[well-known index](#publish-from-a-website)**: an `index.json` under `/.well-known/agent-skills/` listing a website's skills, which the CLI tries before downloading a URL directly.
