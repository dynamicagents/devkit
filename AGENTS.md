# AGENTS.md: working in `devkit`

This package is the repo-level checkers the train's repositories share, and
nothing else. Each repository installs it as a devDependency and calls its
commands from its own `package.json`; that file is the home of which commands a
repository runs. What each command fails on, and every `devkit.config.mjs` key,
is in README.md.

It exists because these checkers used to be a private copy in each repository,
and fixes made to one copy never reached the others. A fix made here reaches
every repository with one version bump, so a fix made anywhere else is the
problem this package was built to remove.

---

## The rules

**1. Node builtins and `semver`, nothing more, at runtime.**
This package lands in the dev tree of every repository in the train, and
g2a-protocol is one of them. A dependency added here is installed by all of
them. `devDependencies` are free: they never leave this repository.

**2. What differs by repository is config, never a branch here.**
A checker reads its repository's `devkit.config.mjs`, and a repository that
needs a different verdict says so there, with its reason beside it. A checker
that tests which repository it is running in has turned a rule into a list of
exceptions that nobody outside this package can read.

**3. A checker takes its repository from the working directory.**
`src/lib/repo.mjs` says why: `npm run` puts every command at the root of the
repository whose script is running, and that is the only input an installed bin
has. Never resolve a path from this package's own location.

---

## Changing a check

A consumer installs `^0.x`, which npm reads as `0.x.*` only. So:

- **Patch** when no repository that passes today can fail after it: a clearer
  message, a fix to a false failure, a new optional config key.
- **Minor** when a repository that passes today might fail: a new check, a
  check that now reads more, a config key that changed meaning. Each repository
  then moves its range on purpose, and its own `check` is where it finds out.

Bump with `npm version patch` or `npm version minor`, not by hand, so
`package-lock.json` follows. How the bump publishes, and how to try a change in
another repository before it does, is README.md, "Releasing".

---

## Working here

```bash
npm run check   # prettier, eslint
npm test        # node:test, every checker against fixture repositories
```

Fixture repositories are built in a temporary directory, never committed:
`test/helpers.mjs` says why.

---

## Copilot reviews a pull request once

Opening a pull request ready for review gets it one Copilot review, requested
automatically, and that is the only one it gets. A push asks for nothing, and a
second review happens only when a person requests one by hand.

So **never wait for a second review**: once Copilot's review has landed, answer
it and hand over, because polling for another waits on something that will not
come. Never request one either, since every review is billed. The workspace's
AGENTS.md, under "Pull requests", has how to tell a review has landed and how to
answer it.
