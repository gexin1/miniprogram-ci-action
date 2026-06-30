import * as os from "os";
import * as core from "@actions/core";
import { parseNumberInput } from "./input.ts";

interface TaskStatus {
  status: "doing" | "done" | "warn" | "fail" | "info";
  message: string;
}

export function getCIBot(): number {
  return parseNumberInput("ci", core.getInput("ci"), 24, {
    min: 1,
    max: 30,
  });
}

export function getThreads(): number {
  return os.cpus().length * 2;
}

export function onProgressUpdate(message: string | TaskStatus): void {
  console.log(
    typeof message === "object"
      ? message.message + " " + message.status
      : message,
  );
}
