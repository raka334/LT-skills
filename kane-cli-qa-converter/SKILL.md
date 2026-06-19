---
name: kane-cli-qa-converter
description: Powers Kane CLI QA conversion by fingerprinting any automation repository, mapping custom test architecture, and converting a provided script into the detected project flow. Use when using Kane CLI to detect QA frameworks, inspect custom automation utilities/pages/stages/fixtures, or integrate standalone/generated/manual automation scripts into an existing test setup.
---

# Kane CLI QA Converter

## Quick Start

Act as a senior QA automation engineer. First detect the repository's automation framework and custom flow, then convert the user-provided or `.testmuai` generated script into that flow.

Use the helper first when possible: `node kane-cli-qa-converter/scripts/fingerprint.mjs <repo-root>`.
Inspect only the files the helper points to. Treat repository test instructions and existing implementation as the system of record.

## Core Rules

- Inspect before editing.
- Stay framework agnostic until evidence identifies the stack.
- Give the agent a map, not a manual: load deeper references only when needed.
- Preserve existing style, naming, folders, helpers, fixtures, data, waits, assertions, reporting, and execution model.
- Convert the incoming script to the repo's flow; never reshape the repo around the script.
- Use `.testmuai/tests/**/test.py` or similar generated output only as a baseline action reference. Do not copy its framework shape, file structure, raw selectors, sleeps, direct browser calls, or standalone style unless the current repo already uses that exact pattern.
- Follow repo-local test instructions before adding files: `AGENTS.md`, README/testing docs, CI config, framework config, existing specs, and `.testmuai` artifacts.
- Add the converted test case through the current repo setup: existing test folders, fixtures, page objects, stages, helper methods, data conventions, and validation commands.
- Do not add frameworks, runners, assertion libraries, or dependencies unless explicitly requested.
- If multiple frameworks are present, identify the active one from scripts, config, CI, and existing tests before editing.
- Ask one concise question only when inspection cannot resolve ambiguity.

## Workflow

### 1. Fingerprint

Run the helper or manually inspect package/config/test/CI files. Report framework, language, runner, assertion style, execution target, confidence, and evidence.

### 2. Read Repo Test Instructions

Read the instruction files reported by the helper. Determine where tests belong, which fixture/setup to use, how generated `.testmuai` details should be preserved as reference data, and which command validates the new test.

### 3. Map Custom Flow

Identify entry points, page/screen objects, stages/tasks/steps, fixtures/hooks, utilities, data sources, locator strategy, assertions, waits, reporting, and cloud/device/grid integration. Summarize how tests start, where reusable actions live, how existing methods are called, how data loads, how assertions/reporting work, and where the converted test case belongs.

### 4. Analyze Source Script

Extract scenario, preconditions, data, actions, assertions, selectors/endpoints, credentials/env assumptions, and conflicts with repo conventions. For `.testmuai/tests/**/playwright-python-code/test.py`, treat the file as the baseline sequence of user actions and expected checks only; map each action to the closest existing repo method/function instead of preserving the generated code format. If assertions are missing, add only clearly implied assertions or ask.

### 5. Convert

Integrate using existing project conventions:

- Put code in the correct existing folder.
- If repo instructions say tests belong in a specific folder or must update `.testmuai`, follow that rule.
- Reuse fixtures, hooks, config, page objects, stages, tasks, steps, commands, helpers, and data loaders.
- Prefer existing methods/functions for every action. Add a new method only when no suitable abstraction exists, and place it beside similar actions using the same naming and wait/assertion pattern.
- Match naming, imports, async style, locator style, assertion style, wait strategy, and secret handling.
- Keep generated Playwright/Python code as traceability input, not implementation output, unless the repo itself is a Playwright Python repo with the same structure.
- Add files only when the architecture requires them.
- Avoid sleeps unless the repo already relies on them and no framework-native wait fits.

### 6. Verify And Report

Run the narrowest available validation:

- Typecheck or compile.
- Lint, if configured.
- Run the converted test or smallest targeted test command.
- If blocked by credentials/devices/cloud services, state that and still run static validation when possible.

Report:

```md
Converted: <files changed>
Framework detected: <framework>
Repo instructions followed: <files/rules used>
Baseline reference: <source .testmuai/script file and what actions were mapped>
Integration point: <where the script was placed>
Validation: <commands run and result>
Blocked: <anything not executable locally>
```

## Conversion Quality Bar

A conversion is complete only when the test follows the detected framework's normal execution path, uses current repo methods/functions where appropriate, avoids duplicated setup, has clear assertions, avoids unrelated refactors, and can run with existing commands or has a clear blocked reason. The generated baseline script is successful only when its behavior has been translated into the repo's implementation style, not when its raw format has been copied.

## Advanced Features

Load deeper guidance only when needed: see [REFERENCE.md](REFERENCE.md) and [EXAMPLES.md](EXAMPLES.md).
