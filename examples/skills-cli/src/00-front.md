<div class="cover">

<div class="cover-kicker">An Unofficial Guide</div>

<div class="cover-title">Inside Skills</div>

<div class="cover-sub">Agent Skills and the skills CLI</div>

<div class="cover-meta">

Covers skills 1.7.4 (tag <code>v1.7.4</code>), commit <code>a80e4c9</code>.<br>
Unofficial and independently written. Not affiliated with, endorsed by, or reviewed by Vercel or the maintainers of skills.

</div>
</div>

<div class="toc-page">

## Contents

<nav id="toc"></nav>

</div>

# Preface {.unnumbered}

## Who this book is for

This book is for developers who install skills into projects or home directories for one or more coding agents. It also serves those who share skills with a team through a repository, automate installs in scripts or CI, or write skills and publish them for others.

The book assumes you are comfortable with a shell, Git, npm and `npx`, JSON, and YAML frontmatter. You need no prior knowledge of agent skills.

The book states where the CLI writes files. How a particular agent loads, triggers, or runs a skill is defined by that agent, and its own documentation describes it.

## What this book covers

The book covers the skill format as the CLI reads it, how a source string is interpreted and searched for skills, and the installation model: scopes, the shared skills directory, agent directories, symlink and copy modes, and lock files. It documents every public command, the workflows for sharing skills through a project, and the ways to publish skills from a Git repository, a website, or an npm package.

It leaves out advice on writing effective instructions, the skills.sh website, and the CLI's internal implementation.

Two commands, `experimental_install` and `experimental_sync`, are experimental. Their names, options, and behavior can change in a later release.

## Versions and environment

The book describes skills 1.7.4 (tag `v1.7.4`, commit `a80e4c9`). `npx skills` usually resolves to the newest release, so run `npx skills@1.7.4` when you need output that matches the book.

The CLI requires Node.js 22.20.0 or later. Any source that the CLI clones with Git, including a `file://` URL, also requires Git on your `PATH`.

macOS and Linux follow the same code paths. Where Windows behaves differently, for example by creating directory junctions instead of symbolic links, the text says so and marks the claim **Unverified**, because no example was run on Windows.

Every listing was captured once, from skills 1.7.4 on macOS. Each run used a fresh temporary directory as `HOME`, local fixture skills as sources, and `DISABLE_TELEMETRY=1`, so no run read or changed a real configuration or sent telemetry. No coding agent was detected during capture. Run from inside an agent, some commands select targets differently, as [Non-interactive mode and agent detection](#non-interactive-mode-and-agent-detection) describes.

## How to read this book

| If you want to… | Read… | You can skip… |
|---|---|---|
| Install skills for yourself now | Chapter 1, then Chapter 4 | Chapters 5 and 6 |
| Understand where files go and why | Chapters 2 and 3 | Chapter 6 |
| Set up skills for a team repository | Chapters 3, 4, and 5 | Chapter 6 |
| Write and publish skills | Chapters 2 and 6 | Chapter 5 |
| Look up a flag, file, or error | Chapter 7 and the appendixes | The narrative chapters |

Chapter 3, [About Scopes, Agents, and Lock Files](#about-scopes-agents-and-lock-files), is foundational. Read it first if you use more than one coding agent on a machine or in a repository. Its model explains why an install can reach agents you did not name and why removing a skill from one agent can affect another.

## Conventions

Commands appear as `npx skills <command>`. Angle brackets mark a placeholder that you replace, brackets included:

```sh
npx skills add <source> --skill <name> -a <agent> -y
```

Examples run in the sandbox that [The sample setup](#the-sample-setup) creates. Its root appears as `/tmp/demo`, the project as `/tmp/demo/project`, and `~` means the sandbox home, `/tmp/demo/home`.

Listings omit the banner logo, color codes, spinner frames, and empty `│` gutter lines. They also omit the `Tip:` line that `add` prints when its input is not a terminal. All other output appears as the CLI printed it.

Callouts carry fixed meanings. A NOTE adds context, an IMPORTANT callout marks a condition the procedure depends on, and a WARNING marks an action that can lose files or expose data. A **Current state (skills 1.7.4)** note marks behavior specific to that release, and an **Unverified:** label marks a claim that no run confirmed.
