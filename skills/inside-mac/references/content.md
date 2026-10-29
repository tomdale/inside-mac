# Choose what the documentation contains

Decide who the reader is, which facts belong in the document, and how to turn source material into statements the reader can trust. Make these decisions before drafting, and revisit them whenever a chapter grows past its budget.

## Write for the builder

The default reader is a builder: an application developer or integrator who calls the system, configures it, or extends it through its supported extension points. The originals taught application developers to use the system software, and this default keeps that reader.

Give the builder what they need to predict behavior, use the system correctly, and recover from failure. Include an implementation detail only when it does one of these jobs:

- It explains a contract. For example, a call blocks because it waits for a disk flush.
- It marks a correctness boundary, such as what is atomic, what is ordered, or what survives a restart.
- It causes a failure the builder must recognize and handle.

Leave out every other implementation detail. Documentation for maintainers is a separate audience. Write it only when the user asks for it, name that audience in the roadmap, and prefer links to the owning team's design documents and code over restating them.

## Keep the document true as long as the design is

Sort each candidate fact by how long it stays true, and treat each kind differently.

| Kind | Examples | Treatment |
|---|---|---|
| Durable | Purpose, mental model, invariants, guarantees and non-guarantees, trade-offs, failure modes | Explain in the narrative. |
| Contract | Signatures, options, limits, and errors the system promises | State once, in the reference, and link to it from the narrative. |
| Implementation | File paths, function names, constants, thresholds, internal wiring | Include only when a reader must act on it, as a link to the code or a row in a reference table. The narrative gives the magnitude and the consequence: "The client retries for about a minute and then fails the request." |
| Transient | Rollouts, migrations in progress, dates, places where documentation and code disagree | Leave out. When transient state changes what a reader should do now, add a short "Current state" note beside the affected material, and name the version or date it describes so that a later editor can find and remove it. |

## Make behavior complete, and link to inventories

A contract is complete when a builder can predict what happens. For each surface a builder uses, cover its guarantees and non-guarantees, its completion states, ownership and lifetime, errors and recovery, and whether a retry is safe. [api-reference.md](api-reference.md) gives the entry templates.

Lists that source code or generated documentation already define belong to that source. Examples are declarations, field lists, status codes, packet layouts, error enumerations, and configuration tables. A copy made by hand goes stale when the code changes, and the reader cannot tell which version it describes. For such a list:

1. Explain the entries that change what a reader does, such as the two errors that are safe to retry or the one field a caller must set.
2. Link to the definition for the rest.
3. When the document needs the full list and nothing generates it, generate it in the documentation build rather than typing it.

Link to the default branch when the reader should read the current code. Link to a commit permalink only when the text depends on specific lines, such as a walk through the steps of one function.

Reproduce a short extract from source only when reading it teaches something the prose cannot. A grammar, the shape of a call, and a minimal configuration file are good candidates.

## State sources as facts

READMEs, AGENTS.md files, design documents, code comments, issues, and transcripts are evidence about the system. They are not voices in the document. Work from them in this order:

1. Verify each claim against the code, or by running the system, where you can.
2. State a verified claim as a fact in the document's own voice: "The scheduler retries a failed job three times." The reader gains nothing from learning which file said so.
3. Restate rationale from comments and design documents in your own words, as part of the explanation. Do not quote comments or project documents in the prose.
4. When a claim the reader would act on cannot be verified, keep it and mark it, for example with a leading **Unverified:** label, so that a reader can weigh it and an editor can check it later. Omit unverifiable claims that do not affect what a reader does.
5. Keep provenance out of the prose. Write what the system does, not how you found out: "Each snapshot includes the lockfile," not "Inspecting the snapshot shows that it includes the lockfile." When the source version matters, record the commit, version, and verification method once, in the front matter.
