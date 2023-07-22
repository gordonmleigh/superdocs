import { statSync } from 'fs';
import { dirname, join } from 'path';

const workspaceRoot = findWorkspaceRoot();

export function getWorkspaceRoot(): string {
  return workspaceRoot;
}

function findWorkspaceRoot(): string {
  for (let curr = __dirname; dirname(curr) !== curr; curr = dirname(curr)) {
    try {
      statSync(join(curr, 'package-lock.json'));
      return curr;
    } catch (err: any) {
      if (err?.code !== 'ENOENT') {
        throw err;
      }
    }
  }
  throw new Error(`couldn't find workspace root`);
}
