# Git Commit Command

To commit all changes using the commit message file, run:

```bash
# Stage all changes
git add .

# Commit using the commit message file
git commit -F commit-message.txt
```

Or in a single command:

```bash
git add . && git commit -F commit-message.txt
```

## Alternative: Copy message to clipboard and commit

If you prefer to review the message first:

```bash
# View the commit message
cat commit-message.txt

# Stage files
git add .

# Commit (you can paste the message or use the file)
git commit -F commit-message.txt
```

## Files to be committed:

Based on `git status`, the following files will be committed:

**Modified:**
- `README.md` - Updated to include apps/ and UI/ references
- `UI/README.md` - Updated with run.sh script documentation
- `commit-message.txt` - Commit message file

**New files:**
- `UI/run.sh` - Script to run static HTML mockups
- `apps/` - Complete Next.js dashboard application
  - `apps/dashboard/` - Next.js project with full structure
  - `apps/README.md` - Apps folder overview
  - All dashboard files and documentation

## Verify before committing:

```bash
# See what will be committed
git status

# See the diff of modified files
git diff --staged

# Review the commit message
cat commit-message.txt
```

## After committing:

```bash
# View the commit
git log -1

# Push to remote (if ready)
git push origin main
# or
git push origin <your-branch-name>
```

