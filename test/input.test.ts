import assert from "node:assert/strict";
import test from "node:test";
import { parseActionType, parseNumberInput } from "../src/utils/input.ts";

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
