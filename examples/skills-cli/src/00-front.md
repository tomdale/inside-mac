<div class="cover">

<div class="cover-kicker">Inside Skills</div>

<div class="cover-title">Agent Skills and the skills CLI</div>

<div class="cover-sub">Installing, managing, and authoring portable instructions for coding agents</div>

<div class="cover-meta">

Covers `skills` v1.7.0 · commit `7407f38`

An unofficial guide, generated as a worked example of the `inside-mac` documentation skills

</div>
</div>

<div class="toc-page">

## Contents

<nav id="toc"></nav>

</div>

# Preface {.unnumbered}

## About This Guide

`skills` is an open source command-line tool, published to npm as the `skills`
package and run as `npx skills …`. It installs, updates, and removes **agent
skills** — small Markdown packages of instructions, named `SKILL.md`, that
extend what a coding agent knows how to do — across more than seventy
different agent harnesses, from Claude Code and Codex to Cursor, OpenCode,
Amp, and many others. Vercel's Guillermo Rauch has publicly described the
project as "the npm of AI skills": a single install command works the same
way whether the skill lives on GitHub, GitLab, Azure Repos, a plain HTTPS
URL, or a local directory.

This guide explains the model behind the CLI, teaches the common workflows,
and specifies the complete command contract, in the style of the classic
*Inside Macintosh* series: orient first, teach the common path, then give
you a reference precise enough to stop guessing at flags.

## Who Should Read This Guide

This guide is for two overlapping audiences:

- **Agent users and platform teams** who want to install shared skills
  across a project or a whole organization's coding agents, in CI or by
  hand.
- **Skill authors** who want to package instructions once and make them
  installable everywhere the CLI targets, instead of hand-copying files
  into each agent's configuration directory.

It assumes you are comfortable with the command line, Git, and npm's
`npx` runner. It does not assume familiarity with any particular coding
agent.

## What to Read

| If you want to… | Read… | You can skip… |
|---|---|---|
| Understand what a skill is and why the CLI exists | Chapter 1, Introduction to Agent Skills | Chapters 4–6 on a first pass |
| Understand the anatomy of a skill package and how sources resolve | Chapter 2, Skill Packages | The command reference |
| Install, list, update, or remove skills day to day | Chapter 3, Installing and Managing Skills | Chapter 5 |
| Find your agent's exact skills directory | Chapter 4, Agent Targets | Chapters 1–2 |
| Write and publish a new skill | Chapter 5, Authoring and Publishing Skills | Chapter 4 |
| Look up exact flags, exit statuses, or files written | Chapter 6, Command Reference | The narrative chapters |

## Version and Commit Covered

This guide describes `skills` **v1.7.0**, cloned from
`https://github.com/vercel-labs/skills` at commit
`7407f3893ad4dceab546ac002c3ef806e4000c73` (short form `7407f38`). Every
command transcript, file path, and table in this guide was checked against
that commit's source and, where shown as a transcript, against real output
captured by running the CLI from a clean temporary `HOME` directory. The
`skills` project moves quickly; re-check flags against `skills --help`
before relying on this guide for a materially newer release.

## Conventions

This guide uses a few consistent markers:

> [!NOTE]
> Optional context that helps you understand *why* something behaves the
> way it does. Skipping a note never breaks a procedure.

> [!IMPORTANT]
> A condition that changes the outcome of the procedure you are reading.
> Read these before you run the command.

> [!WARNING]
> An action with a real, sometimes destructive, consequence — deleting
> files, overwriting an install, or sending data over the network. Read
> the safer alternative before proceeding.

Claims that could not be confirmed directly from the source, tests, or a
real command run are labeled **Inferred**. There are three in this guide;
each names exactly what is uncertain and why.

Command transcripts show a leading `$` for the invocation and the program's
real stdout/stderr below it, trimmed to the lines that matter. Paths use
`~` for the user's home directory and `.` for the current project
directory, matching how the CLI itself shortens paths in its own output.

## About This Project

This is an **unofficial** guide. It is not affiliated with, endorsed by, or
reviewed by Vercel, Inc. or the `skills` maintainers. It was produced as a
worked example of the `inside-mac` documentation skill set, applied to a
real, actively developed open source CLI.

`skills` is copyright its contributors and distributed under the MIT
License. Its source, issue tracker, and license text live at
`https://github.com/vercel-labs/skills`. All command names, flag names, and
short output fragments quoted here are drawn from that public repository;
the surrounding explanation is original to this guide.
</content>
