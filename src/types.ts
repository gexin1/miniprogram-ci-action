export interface Project {
  appid: string;
  type: "miniProgram" | "miniProgramPlugin" | "miniGame" | "miniGamePlugin";
  projectPath: string;
  ignores: string[];
  privateKey?: string;
  privateKeyPath?: string;
}

export interface ProjectConfig {
  appid: string;
  projectname: string;
  libVersion: string;
  miniprogramRoot?: string;
  compileType?: "miniprogram" | "plugin" | "game" | "minigame";
  ignoreUploadUnusedFiles: boolean;
}

export type ActionType = "preview" | "upload";

export type QrcodeFormat = "base64" | "image" | "terminal";

export interface ActionContext {
  project: Project;
  version: string;
  description: string;
  setting: Record<string, unknown>;
  robot: number;
  threads: number;
  useCOS?: boolean;
}
