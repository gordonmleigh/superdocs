import { execSync } from "child_process";

export function getGitSha(): string {
  return execSync(`git rev-parse HEAD`, { stdio: "pipe" }).toString().trim();
}
