# Git Best Practices

This guide outlines the recommended workflow and best practices for managing code versioning in this project.

## 1. Commit Messages (Conventional Commits)

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable messages that are easy to follow when looking through the project history.

**Format:** `<type>(<scope>): <subject>`

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

**Example:**
> `feat(auth): implement jwt strategy for user login`

## 2. Branching Strategy

- **`main`**: The production-ready code. Do not push directly to main.
- **`develop`**: (Optional) Integration branch for features.
- **Feature Branches**: `feat/feature-name` or `feature/feature-name`
- **Bug Fixes**: `fix/bug-name`

**Rule:** Always create a new branch for your work.
`git checkout -b feat/my-new-feature`

## 3. Workflow (Pushing Code)

1.  **Pull changes**: Before you start, make sure you are up to date.
    ```bash
    git checkout main
    git pull origin main
    ```
2.  **Create Branch**:
    ```bash
    git checkout -b feat/your-feature
    ```
3.  **Work & Commit**:
    ```bash
    git add .
    git commit -m "feat(scope): your message"
    ```
4.  **Push**:
    ```bash
    git push -u origin feat/your-feature
    ```
5.  **Pull Request (PR)**: Create a Pull Request on the platform (GitHub/GitLab) to merge your branch into `main`.

## 4. The `git push .` Command

The user mentioned `git push .`. Note that `git push .` is not a standard command.
- To push the current branch to the default remote: `git push`
- To push to a specific remote and branch: `git push origin branch-name`

**Warning**: Avoid using force push (`git push -f`) on shared branches like `main` or `develop`.

## 5. .gitignore

Ensure your `.gitignore` is set up to exclude:
- `node_modules/`
- `.env` (Secrets!)
- `dist/` or `build/`
- OS generated files (`.DS_Store`)

## 6. Pre-commit Hooks

We use Husky to run checks before commits. Ensure you have dependencies installed so hooks can run linting/testing automatically.
