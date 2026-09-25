# Where the patterns come from

These skills were distilled from Apple's *Inside Macintosh* series: the original Volumes I–VI (1985–1991) and the "new" series (1992–1994). This file lists the source passages behind each pattern. It does not reproduce Apple's text: each entry paraphrases the technique and says where to find the original.

Locations are line numbers in the plain-text extraction that `scripts/fetch-sources.sh` and `scripts/extract-text.sh` produce (`pdftotext -layout`, one `.txt` file per PDF). Treat them as approximate. Scan quality varies, and different `pdftotext` versions can shift lines.

Use this file to study the originals. Do not copy their wording into new documentation.

## Stable architecture and reader routing

| Technique | Source | Location |
|---|---|---|
| Declares that nearly every chapter follows one standard structure, then describes it | *Inside Macintosh, Volume VI* (1991) | lines 2640–2643 |
| Tells readers that a few routines cover the basic operations, so they can skip most of a chapter | *Inside Macintosh, Volume III* (1985) | lines 301–305 |
| Admits that most programmers will never need to read everything | *Inside Macintosh, Volume V* (1986) | lines 564–567 |
| Restates the standard chapter structure for the new series | *Inside Macintosh: Memory* (1992) | lines 487–489 |
| Opens a chapter by telling some readers they can skip it entirely | *AOCE Service Access Modules* (1994) | lines 1057–1085 |

## Concept before mechanism

| Technique | Source | Location |
|---|---|---|
| Defines network protocols as rules rather than programs before describing any API | *Inside Macintosh: Networking* (1994) | lines 1647–1655 |
| Explains directories by analogy to small volumes | *Inside Macintosh, Volume IV* (1986) | lines 4618–4625 |
| Positions a data structure by comparing it to an array rather than a database: an analogy that states its own limit | *QuickDraw GX Environment and Utilities* (1994) | lines 11578–11584 |
| Introduces geometric shapes as the building blocks of the whole graphics model | *QuickDraw GX Graphics* (1994) | ~lines 1300–1310 |
| States what a layout shape is for and, immediately, what it is not suited for | *QuickDraw GX Typography* (1994) | ~line 6350 |

## Boundaries and candid scope

| Technique | Source | Location |
|---|---|---|
| States plainly that a manager does not interpret the data it stores | *Inside Macintosh, Volume I* (1985) | lines 4934–4936 |
| Lists the topics the book deliberately does not cover | *Inside Macintosh, Volume III* (1985) | lines 186–199 |
| Warns that internal structures have changed before and will change again | *Inside Macintosh: Memory* (1992) | lines 1280–1284 |
| Explains how an old subsystem and its replacement coexist | *QuickDraw GX Graphics* (1994) | lines 995–998 |

## Task-oriented progressive disclosure

| Technique | Source | Location |
|---|---|---|
| Names the minimal set of routines that most callers need | *Inside Macintosh, Volume I* (1985) | lines 5378–5379 |
| Opens task sections with a statement of the goal | *AOCE Service Access Modules* (1994) | lines 2494–2507 |
| Gives an ordered preview of what a section will cover | *Inside Macintosh: Sound* (1994) | lines 4144–4153 |
| Uses goal-first task headings and steps | *Macintosh Toolbox Essentials* (1992) | lines 1148–1160 |

## Contracts, async behavior, and errors

| Technique | Source | Location |
|---|---|---|
| Distinguishes "request queued" from "operation completed" | *Inside Macintosh: Devices* (1994) | lines 1385–1390 |
| Requires callers to fully specify input structures | *AOCE Service Access Modules* (1994) | lines 7806–7830 |
| Explains how to retrieve errors from routines that do not return them | *Inside Macintosh: Memory* (1992) | lines 3085–3089 |
| Attaches an execution-context restriction and its reason to the routine it constrains | *Inside Macintosh: Sound* (1994) | lines 9997–9999 |
| Marks a structure as opaque to callers | *Inside Macintosh: QuickTime* (1993) | lines 4848–4855 |

## Compatibility and capability detection

| Technique | Source | Location |
|---|---|---|
| States the principle: do not depend on things that may change | *Inside Macintosh, Volume V* (1986) | lines 844–846 |
| Tells readers to test for features instead of checking version numbers | *Inside Macintosh, Volume VI* (1991) | lines 2630–2637 |
| Tells readers to ask the system about a capability directly | *Operating System Utilities* (1994) | lines 1055–1072 |
| Requires a capability check before calling a manager | *QuickDraw GX Environment and Utilities* (1994) | lines 11877–11888 |

## Warnings and consequences

| Technique | Source | Location |
|---|---|---|
| States the concrete consequence of ignoring a warning (crashes, data loss) | *PowerPC System Software* (1994) | lines 561–565 |
| Marks a routine obsolete and points to its replacement | *Inside Macintosh: Devices* (1994) | lines 10109–10127 |
| Uses absolute prohibitions for protocol obligations | *QuickDraw GX Printing Extensions and Drivers* (1994) | lines 9890–9914 |
| Grounds interface guidance in what people already know | *Macintosh Human Interface Guidelines* (1992) | lines 2500–2505 |

## Controlled terminology and cross-reference

| Technique | Source | Location |
|---|---|---|
| Glossary entries with "See also" links | *X-Ref: Glossary* (1994) | lines 57–58 |
| Glossary entries with "Compare" links between neighboring terms | *X-Ref: Glossary* (1994) | lines 49–51 |
| Numbered senses for overloaded terms | *X-Ref: Glossary* (1994) | lines 3280–3292 |

## Practices to modernize rather than copy

| Aged practice | Source | Location |
|---|---|---|
| Hedging about whether samples were compiled or tested | *Interapplication Communication* (1993) | lines 1305–1321 |
| Disclaiming sample code as not intended for use | *QuickDraw GX Printing Extensions and Drivers* (1994) | lines 948–963 |
| Samples with deliberately limited error handling | *PowerPC System Software* (1994) | lines 654–669 |
