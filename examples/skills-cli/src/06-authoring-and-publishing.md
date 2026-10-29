# Authoring and Publishing Skills

This chapter is for people who write skills for others to install. It builds the `acme-skills` source that earlier chapters install from, tests it, and publishes it from a Git repository, a website, or an npm package. Read only the publishing section for your channel.

## Before you begin

- Read [The SKILL.md contract](#the-skill-md-contract) and [How the CLI discovers skills](#how-the-cli-discovers-skills) in Chapter 2.
- Build the sandbox in [The sample setup](#the-sample-setup), leaving out `acme-skills`, which this chapter creates in `/tmp/demo`.

## In this chapter you will

- create, fill in, and test a skill;
- publish it from Git, a website, or npm;
- hide a skill that is not ready.

## Create a skill

Create the `skills` container directory, then run [`skills init`](#skills-init) with the skill's name:

```console
$ mkdir -p acme-skills/skills && cd acme-skills/skills
$ npx skills init release-notes
Initialized skill: release-notes

Created:
  release-notes/SKILL.md
…
```

The template sets `name: release-notes`, a placeholder description, and placeholder headings and steps.

Run without a name, `init` writes `SKILL.md` into the current directory and takes the name from that directory, so `mkdir changelog-lint && cd changelog-lint && npx skills init` creates a skill named `changelog-lint`. If the target `SKILL.md` already exists, `init` prints `Skill already exists at release-notes/SKILL.md`, leaves the file unchanged, and exits with status 0.

## Write the description and instructions

Replace the template with the real description and instructions, and add `template.md`, the file the instructions refer to. [The sample setup](#the-sample-setup) shows both finished files.

Keep `name` identical to the directory name, and use only lowercase letters, digits, and single hyphens. The CLI names the installed directory after the sanitized `name`, not after the source folder ([Skill names and install directories](#skill-names-and-install-directories)). When the two agree, the folder a consumer sees in your repository is the one that appears in their project.

Write the `description` to say what the skill does and when to use it. The CLI shows it beside the name in `--list` output and in the selection prompt, and the installed `SKILL.md` carries it to the agent.

Refer to supporting files by paths relative to the skill directory, as the instructions do with `template.md`. The CLI installs the whole directory, so the path resolves the same way after installation.

## Test a skill before publishing

From `/tmp/demo`, run `npx skills add ./acme-skills --list` to see the source as a consumer would. It prints each skill's name and description. A skill missing from the list was skipped, and the warning above the list gives the reason ([The SKILL.md contract](#the-skill-md-contract)). Fix every warning before you publish, because consumers never see a skipped skill.

Next, from `project/`, run `npx skills use ../acme-skills --skill release-notes` to print the exact prompt an agent would receive ([Try a skill without installing it](#try-a-skill-without-installing-it)). Then install the skill into the scratch project with `npx skills add ../acme-skills --skill release-notes -a claude-code -y`, and confirm that `.claude/skills/release-notes` holds both `SKILL.md` and `template.md`.

## Lay out a repository of skills

Put each skill in its own directory under `skills/`, as `acme-skills` does with `skills/release-notes/SKILL.md`. You can group skills in category folders, such as `skills/release/release-notes/`, within the depth that discovery walks. Do not put a `SKILL.md` at the root of a repository that holds several skills. A root skill hides every other skill unless consumers pass `--full-depth`. To present skills in named groups, declare them in a plugin manifest. [How the CLI discovers skills](#how-the-cli-discovers-skills) gives the rules for all three.

## Publish from a Git repository

Commit the skills, tag the release, and push both:

```sh
git tag v1.0.0
git push origin main v1.0.0
```

Consumers install from `acme/acme-skills`, select one skill with `acme/acme-skills@release-notes` or a tree URL such as `https://github.com/acme/acme-skills/tree/v1.0.0/skills/release-notes`, or pin the release with `acme/acme-skills#v1.0.0` ([Source formats](#source-formats)).

Tag every release so that consumers can pin one ([Pinning a ref and naming a skill](#pinning-a-ref-and-naming-a-skill)). Consumers pin a tag to keep the content they reviewed. `update` rechecks the recorded ref, so moving the tag makes their next update install content they never reviewed. Publish a new tag instead.

Consumers clone a private repository with the Git credentials, GitHub CLI login, or SSH keys they already have ([Network access, authentication, and telemetry](#network-access-authentication-and-telemetry)).

## Publish from a website

A website can publish a catalog through a well-known index. Serve `index.json` at `/.well-known/agent-skills/index.json`; the CLI also reads the older `/.well-known/skills/index.json`. The [Agent Skills site](https://agentskills.io) defines the schema. How the CLI validates an index depends on its `$schema` field:

- With the v0.2.0 schema URL, each entry names one artifact by `type`, `url`, and SHA-256 `digest`. The CLI drops, without a warning, any entry with an invalid name, description, `type`, `url`, or digest, and any skill whose downloaded artifact does not match its digest.
- Without `$schema`, the index uses the older format that lists each skill's files, and one invalid entry makes the CLI reject the whole index.
- With any other `$schema`, the CLI ignores the index.

A valid name has 1 to 64 lowercase letters, digits, and hyphens, with no leading, trailing, or doubled hyphen. Run `npx skills add https://acme.dev --list` after each deploy and confirm that every skill appears.

A consumer who adds a URL with a path, such as `https://acme.dev/team/docs`, gets only an index under that path. When none exists there but the host has a root index, the command fails with `No skills found for the scoped path '/team/docs'` instead of installing the host's whole catalog.

A website can also offer one file for direct download: a `SKILL.md`, a ZIP archive, or a tar archive, gzipped or not. If your host serves a root well-known index, a direct-download URL under a path on that host fails with the scoped-path error. Either list the skill in the index, or serve direct downloads from a host that has no index.

Keep direct downloads within these limits, or tell consumers which variable to set to a larger byte or file count:

| Limit | Default | Variable |
|---|---|---|
| Download size | 10 MiB | `SKILLS_DOWNLOAD_MAX_BYTES` |
| Extracted size | 25 MiB | `SKILLS_EXTRACT_MAX_BYTES` |
| Files in an archive | 1,000 | `SKILLS_EXTRACT_MAX_FILES` |

## Ship skills in an npm package

Put the skills in `skills/<name>/` or `dist/skills/<name>/` in the package, one level deep. If the package has a `files` list, include that directory:

```json
{
  "name": "acme-skills",
  "version": "1.0.0",
  "files": ["skills"]
}
```

Run `npm pack --dry-run` and confirm that each `SKILL.md` and supporting file appears in the list. Consumers install the package and run sync, as [Sync skills shipped in npm packages](#sync-skills-shipped-in-npm-packages) describes.

## Hide work-in-progress skills

To publish a skill without offering it to everyone, add this to its frontmatter:

```yaml
metadata:
  internal: true
```

Internal skills appear only when named ([Selecting skills to install](#selecting-skills-to-install)). Anyone who can read the source can still read and install it.
