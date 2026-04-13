# Git Author Change Plan

## Overview
Change Git author information for the HP-12C repository:
- **New Username:** apezoo
- **New Email:** apezoo@protonmail.com
- **Scope:** All commits (entire history) + future commits

## Process Steps

### 1. Set Local Git Configuration (Future Commits)
Configure the repository to use the new author information for all future commits:

```bash
cd /home/mauerm/tools/scripts/hp-taschenrechner/HP-12C
git config user.name "apezoo"
git config user.email "apezoo@protonmail.com"
```

This sets the configuration **locally** for this repository only (stored in `.git/config`).

### 2. Create Backup Branch
Before rewriting history, create a backup branch for safety:

```bash
git branch backup-before-author-change
```

### 3. Rewrite Git History
Use `git filter-branch` to rewrite all commits in the repository history:

```bash
git filter-branch --env-filter '
CORRECT_NAME="apezoo"
CORRECT_EMAIL="apezoo@protonmail.com"

export GIT_COMMITTER_NAME="$CORRECT_NAME"
export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
export GIT_AUTHOR_NAME="$CORRECT_NAME"
export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
' --tag-name-filter cat -- --branches --tags
```

**What this does:**
- Rewrites **all commits** on **all branches** and **tags**
- Changes both author and committer information
- Preserves commit timestamps and messages
- Creates new commit hashes (SHA-1 values)

### 4. Verify History Rewrite
Check that the author information has been updated:

```bash
# View recent commits with author info
git log --format="%H %an <%ae> - %s" -10

# Count commits by author
git shortlog -sne
```

### 5. Update Remote Repository (If Pushed)
If this repository has been pushed to a remote (GitHub, GitLab, etc.), you'll need to force push:

```bash
# ⚠️ WARNING: This will overwrite remote history
git push --force --all origin
git push --force --tags origin
```

**Important:** Coordinate with any collaborators before force-pushing!

### 6. Clean Up
After verifying everything works, clean up the backup:

```bash
# Remove backup branch (optional, after verification)
git branch -D backup-before-author-change

# Clean up filter-branch refs
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## Implications & Warnings

### ⚠️ Critical Warnings

1. **History Rewrite Changes Commit Hashes**
   - All commit SHA-1 hashes will change
   - This breaks any links to specific commits
   - Any clones of this repository will diverge

2. **Force Push Required**
   - If already pushed to remote, requires `git push --force`
   - Will break other users' local clones
   - They'll need to re-clone or reset their local copies

3. **Collaboration Impact**
   - Notify all collaborators before doing this
   - They should backup their work
   - After the change, they should:
     ```bash
     git fetch origin
     git reset --hard origin/main  # or master
     ```

4. **Cannot Be Undone Easily**
   - Once force-pushed, very difficult to revert
   - Keep the backup branch until certain

### ✅ Benefits

1. **Clean History**
   - All commits attributed to correct author
   - Consistent identity throughout project

2. **Future Commits**
   - Automatically use new author info
   - No additional configuration needed per commit

## Alternative: Change Only Future Commits

If you don't want to rewrite history, you can skip steps 2-6 and only execute step 1. This will:
- Keep existing commits with their current authors
- Only affect new commits going forward
- No force push required
- Much safer approach

## Repository Status Check

Before proceeding, verify:
- [ ] Check if repository has remote: `git remote -v`
- [ ] Check current branch: `git branch`
- [ ] Check if there are uncommitted changes: `git status`
- [ ] Verify there are no running/pending operations: Check `.git/` directory

## Execution Checklist

- [ ] Backup important work
- [ ] Set local git config (user.name & user.email)
- [ ] Create backup branch
- [ ] Run filter-branch command
- [ ] Verify with git log
- [ ] Test basic git operations (commit, checkout)
- [ ] Force push to remote (if applicable)
- [ ] Notify collaborators (if applicable)
- [ ] Clean up backup and refs

## Recovery Plan

If something goes wrong:

```bash
# Restore from backup branch
git checkout backup-before-author-change
git branch -D main  # or your main branch name
git checkout -b main
```

## References

- Git Documentation: https://git-scm.com/docs/git-filter-branch
- Alternative tool: git-filter-repo (faster, recommended for large repos)
- GitHub Guide: https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/changing-your-commit-email-address
