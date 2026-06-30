import assert from "node:assert/strict";
import test from "node:test";
import {
  parseActionType,
  parseBooleanInput,
  parseJSONInput,
  parseNumberInput,
} from "../src/utils/input.ts";

test("parseActionType defaults to upload", () => {
  assert.equal(parseActionType(""), "upload");
  assert.equal(parseActionType("  "), "upload");
});

test("parseActionType accepts supported actions", () => {
  assert.equal(parseActionType("preview"), "preview");
  assert.equal(parseActionType("upload"), "upload");
});

test("parseActionType rejects unsupported actions", () => {
  assert.throws(
    () => parseActionType("deploy"),
    /action_type must be "preview" or "upload"/,
  );
});

test("parseNumberInput applies defaults and validates integer range", () => {
  assert.equal(parseNumberInput("ci", "", 24, { min: 1, max: 30 }), 24);
  assert.equal(parseNumberInput("ci", "1", 24, { min: 1, max: 30 }), 1);
  assert.equal(parseNumberInput("ci", "30", 24, { min: 1, max: 30 }), 30);

  assert.throws(
    () => parseNumberInput("ci", "0", 24, { min: 1, max: 30 }),
    /ci must be >= 1/,
  );
  assert.throws(
    () => parseNumberInput("ci", "31", 24, { min: 1, max: 30 }),
    /ci must be <= 30/,
  );
  assert.throws(
    () => parseNumberInput("ci", "1.5", 24, { min: 1, max: 30 }),
    /ci must be an integer/,
  );
});

test("parseBooleanInput applies defaults and validates booleans", () => {
  assert.equal(parseBooleanInput("use_cos", "", undefined), undefined);
  assert.equal(parseBooleanInput("use_cos", "", false), false);
  assert.equal(parseBooleanInput("use_cos", "true"), true);
  assert.equal(parseBooleanInput("use_cos", "1"), true);
  assert.equal(parseBooleanInput("use_cos", "no"), false);

  assert.throws(
    () => parseBooleanInput("use_cos", "maybe"),
    /use_cos must be a boolean/,
  );
});

test("parseJSONInput parses JSON and rejects invalid JSON", () => {
  assert.deepEqual(
    parseJSONInput("setting_json", '{"useProjectConfig":true}', {}),
    { useProjectConfig: true },
  );
  assert.deepEqual(parseJSONInput("setting_json", "", { a: 1 }), { a: 1 });

  assert.throws(
    () => parseJSONInput("setting_json", "{", {}),
    /setting_json must be valid JSON/,
  );
});
