import { execSync } from 'child_process';

let result: string | undefined;

export function getGitSha(): string {
  if (!result) {
    result = execSync(`git rev-parse HEAD`, { stdio: 'pipe' })
      .toString()
      .trim();
  }
  return result;
}
