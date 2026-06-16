#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2] || process.cwd();
const maxFiles = 5000;
const ignored = new Set([
  ".git",
  ".agents",
  ".opencode",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  "target",
  "bin",
  "obj",
  "framework-agnostic-qa-converter",
  "kane-cli-qa-converter"
]);
const files = [];

function walk(dir) {
  if (files.length >= maxFiles) return;
  for (const name of readdirSync(dir)) {
    if (ignored.has(name)) continue;
    const full = join(dir, name);
    const rel = relative(root, full);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full);
    else files.push(rel);
  }
}

if (!existsSync(root)) {
  console.error(JSON.stringify({ error: `Path not found: ${root}` }, null, 2));
  process.exit(1);
}

walk(root);

const has = (pattern) => files.some((file) => pattern.test(file));
const read = (file) => {
  try {
    return readFileSync(join(root, file), "utf8");
  } catch {
    return "";
  }
};

const packageJson = has(/^package\.json$/) ? read("package.json") : "";
const textEvidence = files
  .filter((file) => /\.(js|jsx|ts|tsx|mjs|cjs|py|java|cs|rb|robot|feature|xml|ya?ml|json|toml|ini)$/.test(file))
  .slice(0, 300)
  .map((file) => `${file}\n${read(file).slice(0, 4000)}`)
  .join("\n");

const signals = [
  ["Playwright", /@playwright\/test|playwright\.config\.|\bpage\.locator\(|\btest\(/, ["playwright.config", "@playwright/test"]],
  ["Cypress", /cypress\.config\.|\bcy\.|Cypress\.Commands/, ["cypress.config", "cy."]],
  ["WebdriverIO", /wdio\.conf\.|webdriverio|@wdio\/|expect-webdriverio/, ["wdio.conf", "webdriverio"]],
  ["Selenium", /selenium-webdriver|org\.openqa\.selenium|from selenium import|WebDriverWait|driver\.findElement|By\./, ["selenium", "WebDriver"]],
  ["Appium", /appium\.(config|conf)|@wdio\/appium-service|from appium|io\.appium|MobileElement|automationName\s*[:=]\s*["']?(UiAutomator2|XCUITest)/, ["appium", "mobile capabilities"]],
  ["TestCafe", /testcafe|\bSelector\(|\bfixture`/, ["testcafe", "Selector"]],
  ["Puppeteer", /puppeteer|from ["']puppeteer["']|require\(["']puppeteer["']\)/, ["puppeteer", "newPage"]],
  ["Robot Framework", /\*\*\* Test Cases \*\*\*|\.robot$/, [".robot", "*** Test Cases ***"]],
  ["Cucumber/BDD", /\.feature$|\bGiven\(|\bWhen\(|\bThen\(/, [".feature", "Given/When/Then"]],
  ["Pytest", /pytest|conftest\.py|test_.*\.py/, ["pytest", "conftest.py"]],
  ["JUnit/TestNG", /testng\.xml|org\.junit|@Test|junit-platform/, ["@Test", "testng.xml"]]
];

const haystack = `${packageJson}\n${files.join("\n")}\n${textEvidence}`;
const frameworks = signals
  .map(([name, pattern, hints]) => ({ name, score: pattern.test(haystack) ? 1 : 0, hints }))
  .filter((item) => item.score > 0);

const configFiles = files.filter((file) => /(playwright|cypress|wdio|nightwatch|testng|pytest|robot|karma|hyperexecute|browserstack|sauce|lambdatest|jenkins|gitlab-ci|workflow)/i.test(file));
const instructionFiles = files
  .filter((file) => /(^|\/)(AGENTS|CONTEXT|README|TESTING|CONTRIBUTING|CHANGELOG)(\.|$)|(^|\/)docs\/|(^|\/)\.testmuai\//i.test(file))
  .slice(0, 80);
const testFiles = files.filter((file) => /(spec|test|feature|robot)/i.test(file)).slice(0, 50);
const customFlowCandidates = files
  .filter((file) => /(^|\/)(pages?|screens?|stages?|steps?|fixtures?|helpers?|utils?|commands?|keywords?|testdata)(\/|$)/i.test(file))
  .slice(0, 80);

let packageScripts = {};
try {
  packageScripts = packageJson ? JSON.parse(packageJson).scripts || {} : {};
} catch {
  packageScripts = { parseError: "package.json exists but could not be parsed" };
}

console.log(JSON.stringify({
  root,
  detectedFrameworks: frameworks,
  confidence: frameworks.length === 1 ? "high" : frameworks.length > 1 ? "medium" : "low",
  packageScripts,
  instructionFiles,
  configFiles,
  testFiles,
  customFlowCandidates,
  note: "Use this as a compact map. Read only relevant evidence files next."
}, null, 2));
