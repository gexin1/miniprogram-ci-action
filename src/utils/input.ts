import type { ActionType } from "../types.ts";

interface NumberInputOptions {
  min?: number;
  max?: number;
}

export function parseActionType(value: string): ActionType {
  const actionType = value.trim() || "upload";

  if (actionType === "preview" || actionType === "upload") {
    return actionType;
  }

  throw new Error(`action_type must be "preview" or "upload", got "${value}"`);
}

export function parseNumberInput(
  name: string,
  value: string,
  defaultValue: number,
  options: NumberInputOptions = {},
): number {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return defaultValue;
  }

  const numberValue = Number(normalizedValue);

  if (!Number.isInteger(numberValue)) {
    throw new Error(`${name} must be an integer, got "${value}"`);
  }

  if (options.min !== undefined && numberValue < options.min) {
    throw new Error(`${name} must be >= ${options.min}, got ${numberValue}`);
  }

  if (options.max !== undefined && numberValue > options.max) {
    throw new Error(`${name} must be <= ${options.max}, got ${numberValue}`);
  }

  return numberValue;
}
