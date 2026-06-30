import type { ActionType, QrcodeFormat } from "../types.ts";

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

export function parseQrcodeFormat(value: string): QrcodeFormat {
  const qrcodeFormat = value.trim() || "base64";

  if (
    qrcodeFormat === "base64" || qrcodeFormat === "image" ||
    qrcodeFormat === "terminal"
  ) {
    return qrcodeFormat;
  }

  throw new Error(
    `qrcode_format must be "base64", "image", or "terminal", got "${value}"`,
  );
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

export function parseBooleanInput(
  name: string,
  value: string,
  defaultValue?: boolean,
): boolean | undefined {
  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue) {
    return defaultValue;
  }

  if (["true", "1", "yes", "y"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "0", "no", "n"].includes(normalizedValue)) {
    return false;
  }

  throw new Error(`${name} must be a boolean, got "${value}"`);
}

export function parseJSONInput<T>(
  name: string,
  value: string,
  defaultValue: T,
): T {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return defaultValue;
  }

  try {
    return JSON.parse(normalizedValue) as T;
  } catch (error) {
    throw new Error(
      `${name} must be valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
