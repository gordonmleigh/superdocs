import { existsSync } from "fs";
import ts from "typescript";

export class CompilationError extends Error {
  static formatMessage(diagnostics: readonly ts.Diagnostic[]): string {
    return ts.formatDiagnostics(diagnostics, {
      getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
      getNewLine: () => ts.sys.newLine,
      getCanonicalFileName: ts.sys.useCaseSensitiveFileNames
        ? (x) => x
        : (x) => x.toLowerCase(),
    });
  }

  constructor(public readonly diagnostics: readonly ts.Diagnostic[]) {
    super(`compilation error\n` + CompilationError.formatMessage(diagnostics));
  }
}

export function loadProgram(entryPoints: string[]): ts.Program {
  if (entryPoints.length === 0) {
    throw new Error(`expected at least one entrypoint`);
  }
  const configPath = ts.findConfigFile(entryPoints[0], existsSync);

  let config: ts.ParsedCommandLine | undefined;
  if (configPath) {
    config = ts.getParsedCommandLineOfConfigFile(
      configPath,
      undefined,
      ts.sys as any,
    );
  }
  if (config) {
    config.options.composite = false;
  }

  const program = ts.createProgram(entryPoints, config?.options ?? {});
  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length) {
    throw new CompilationError(diagnostics);
  }

  return program;
}
