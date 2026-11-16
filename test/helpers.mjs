/**
 * Fixtures for the devkit's own suite: repositories in a temporary directory.
 *
 * Nothing is committed here. A committed fixture holding a deliberately dead
 * reference or a deliberately undeclared import would sit inside a scanned
 * directory of a repository running these checkers, and they would report it.
 *
 * Not a `*.test.mjs`, so the `node --test` glob does not pick it up.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 * Repositories of `{ relative path: contents }`, cleaned up together.
 *
 * `clean` is handed to `afterEach` by the caller rather than registered here,
 * because a module that registers a hook changes the behaviour of every file
 * that imports it.
 */
export function repositories() {
  const built = [];
  const repo = (files) => {
    const root = mkdtempSync(path.join(tmpdir(), "devkit-repo-"));
    built.push(root);
    write(root, files);
    return root;
  };
  const clean = () => {
    while (built.length > 0)
      rmSync(built.pop(), { recursive: true, force: true });
  };
  return { repo, clean };
}

/** `{ relative path: contents }` into `root`, creating directories as needed. */
export function write(root, files) {
  for (const [name, contents] of Object.entries(files)) {
    const full = path.join(root, ...name.split("/"));
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, contents);
  }
}

/** A loaded `devkit.config.mjs`, as the checkers receive it. */
export const config = (sections) => ({ configured: true, sections });
