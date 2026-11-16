# `@dynamicagents/devkit`

The repo-level checkers the Dynamic Agents repositories share. Each repository
installs this package as a devDependency and runs its commands, so a fix to a
checker is made once, here, and reaches every repository with a version bump.

## The commands

Each runs from a repository root, which is where `npm run` puts it. The findings
live in `src/lib/`; the command prints them and sets the exit code.

| command                       | what it fails on                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `devkit-verify-references`    | a comment naming a path that is not there                                                 |
| `devkit-verify-peer-ranges`   | a peer range the installed tree does not satisfy; `--latest` reports against the registry |
| `devkit-verify-runtime-types` | committed runtime types carrying a global `Env`                                           |
| `devkit-verify-exports`       | built output that is not safe to publish                                                  |
| `devkit-link-local`           | not a check: packs the sibling checkouts and installs them                                |

## What a repository wires

```bash
npm install --save-dev @dynamicagents/devkit
```

Then, in its `package.json`, the commands it runs:

```jsonc
"scripts": {
  "verify:references": "devkit-verify-references",
  "verify:exports": "devkit-verify-exports"
}
```

A devDependency is not a dependency of what a repository publishes, so
`zeroDependencies` below holds for a package that installs this one.

## `devkit.config.mjs`

Per-repository rules go in one module at the repository root, a section per
checker. Every key is optional and the file itself is too; a checker with no
section does what it does everywhere, and one that cannot work without a section
says which key is missing.

```js
export default {
  // `devkit-verify-references`
  references: {
    scan: ["src", "test", "scripts"], // directories read, and the roots a rooted reference may start at
    loose: ["README.md", "AGENTS.md"], // root files read whole for prose
    external: new Map([["./elsewhere.ts", "why this one is not ours"]])
  },

  // `devkit-verify-exports`
  exports: {
    realmExempt: ["./testing"], // subpaths that are a test harness
    nodeOnly: ["./sandbox/daemon"], // subpaths whose realm is Node, not a Worker
    buildsOn: { "./computer": ["./sandbox"] }, // turns subpath isolation on, with its exceptions
    forbidRootExport: true, // no "." barrel
    zeroDependencies: true // no bare import in dist/, no dependency keys
  },

  // `devkit-link-local`
  linkLocal: {
    siblings: ["core"], // required checkouts
    optional: ["g2a-protocol"] // packed when present
  }
};
```

It is a module rather than JSON because every entry carries prose: why a root
file is scanned, why a path is allowed, why one subpath may reach another. An
allowlist without reasons becomes a silencer, and JSON has nowhere to write one.

## Releasing

A version bump reaching `main` is what ships it: on the first green Test run for
that commit, `release.yml` publishes to npm and then tags the release. A merge
without a bump publishes nothing. The protocol is dev-agents'
`.github/workflows/npm-release.yml`.

To try a change in another repository before releasing it, `npm pack` here and
install the tarball there with `npm install --no-save <path to the .tgz>`.
