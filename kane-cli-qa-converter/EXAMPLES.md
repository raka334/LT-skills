# Kane CLI QA Converter Examples

This file is intentionally documentation-only. Do not add `example.js` unless Kane CLI needs a runnable demo or deterministic validation harness.

## Example Request

```txt
Convert `login-flow.js` into this repo's automation framework.
```

```txt
Use `.testmuai/tests/output-2026-06-19T06-44-33/playwright-python-code/test.py` as the baseline action reference, then add the equivalent test case using this repo's existing setup.
```

## Expected Agent Flow

1. Run `node kane-cli-qa-converter/scripts/fingerprint.mjs .`.
2. Read the top evidence files returned by the helper.
3. Read repo test instructions returned by the helper.
4. Summarize framework, language, runner, assertion style, confidence, and evidence.
5. Map the custom flow from existing tests and helpers.
6. Read the source script or `.testmuai` baseline `test.py` to extract actions, data, selectors, and assertions.
7. Map each baseline action to current repo methods/functions before writing code.
8. Convert into the instructed existing structure without copying the generated baseline format.
9. Run the smallest available validation.
10. Report changed files, repo instructions followed, baseline mapping, and validation results.

## Report Template

```md
Framework: <detected framework>
Language: <detected language>
Runner: <detected runner>
Assertion style: <detected assertion style>
Execution target: <local|cloud|mobile|api|browser>
Confidence: <high|medium|low>
Evidence: <specific package/config/test/CI files>
Repo instructions: <instruction files/rules used>
Baseline reference: <source script or .testmuai test.py used only for action mapping>

Custom Flow:
1. Tests start from <detected test entry point>.
2. Reusable actions live in <pages|screens|stages|steps|tasks|helpers|keywords>.
3. Test data is loaded from <detected data source>.
4. Assertions use <detected assertion pattern>.
5. Converted test belongs in <target file/folder>.
6. Baseline actions map to <existing methods/functions or new minimal method locations>.

Converted: <files changed>
Repo instructions followed: <files/rules used>
Baseline mapping: <brief action-to-repo-method summary>
Validation: <commands run and result>
Blocked: <anything not executable locally>
```

## Minimal Conversion Policy

If a source script duplicates an existing login helper, call the helper. Do not paste the login steps again.

If a source script uses raw sleeps but the framework has locator auto-waiting, replace sleeps with the existing wait pattern.

If a source script hardcodes a URL or credential but the repo uses env/config, move the value through the existing config mechanism.

If a `.testmuai` baseline uses `page.click`, `page.fill`, raw XPath/CSS, or `time.sleep`, translate those into the repo's existing action methods, locator conventions, and wait helpers.

If no existing method covers a baseline action, add the smallest method in the established page/screen/helper layer and call it from the new test case.
