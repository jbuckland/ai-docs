# Git Workflow and Rules

## Branching Strategy

**Feature branches:**
- Create from `main` or `develop`
- Name format: `feat/description` or `fix/description`
- Examples: `feat/user-profile`, `fix/login-bug`

**Rules:**
- ✅ Always work on a feature branch
- ✅ Never commit directly to `main` or `develop`
- ✅ Pull latest changes before starting work
- ✅ Rebase on parent branch before merging

## Commit Message Format

```
<type>: <short description>

<optional detailed description>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add user profile page

fix: resolve login redirect issue

refactor: extract user service logic

docs: update API documentation

test: add unit tests for user service
```

## Commit Message Rules

- ✅ Keep first line under 72 characters
- ✅ Capitalize first letter
- ✅ No period at the end of the subject line
- ✅ Separate subject from body with blank line
- ✅ Describe WHAT and WHY, not HOW

## AI Attribution Rules

**CRITICAL:** Do NOT add AI attribution in commits.

```
❌ WRONG:
feat: add user profile

Generated with Claude/ChatGPT/Copilot
Co-Authored-By: AI Assistant

✅ CORRECT:
feat: add user profile

- Implements user profile page with avatar upload
and bio editing functionality.
```

**Rules:**
- ❌ No "Generated with [AI tool]" messages
- ❌ No "Co-Authored-By: [AI tool]" footers
- ❌ No AI attribution in commit messages
- ✅ Commits should appear as if written by the developer

## Squash Commits Pattern

Before merging, squash related commits:

```bash
# Interactive rebase
git rebase -i HEAD~3

# In the editor, mark commits to squash:
pick abc1234 feat: add user model
squash def5678 fix: typo in user model
squash ghi9012 refactor: improve user model

# Result: Single clean commit
feat: add user model with validation
```

## .gitignore Patterns

```gitignore
# Dependencies
node_modules/
bower_components/

# Build output
dist/
build/
*.js.map

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local

# Logs
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/
```

## Rebase Workflow

```bash
# Update local main
git checkout main
git pull origin main

# Rebase feature branch
git checkout feature/my-feature
git rebase main

# Resolve conflicts if any
git add .
git rebase --continue

# Force push (if already pushed)
git push --force-with-lease
```

## Best Practices

### DO
- ✅ Pull latest changes before starting work
- ✅ Commit frequently with meaningful messages
- ✅ Rebase on parent branch before merging
- ✅ Squash commits for clean history
- ✅ Review your own changes before committing
- ✅ Use descriptive branch names

### DON'T
- ❌ Commit directly to `main` or `develop`
- ❌ Push broken code
- ❌ Commit large binary files
- ❌ Include secrets or credentials
- ❌ Add AI attribution to commits
- ❌ Use vague commit messages like "fix stuff" or "updates"

## Git Commands Reference

```bash
# Create and switch to new branch
git checkout -b feature/my-feature

# Stage changes
git add .
git add specific-file.ts

# Commit
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Pull latest changes
git pull origin main

# Rebase
git rebase main

# Squash last 3 commits
git rebase -i HEAD~3

# Amend last commit
git commit --amend

# Stash changes
git stash
git stash pop

# View history
git log --oneline --graph
```
