# Contributing

## Deployment Pipeline

Every push to `master` triggers the deployment pipeline:

```
┌─────────┐      ┌─────────────┐      ┌──────────────┐
│  Build  │ ───▶ │   Staging   │ ───▶ │  Production  │
└─────────┘      └─────────────┘      └──────────────┘
                   (automatic)        (manual approval)
```

### Jobs

| Job | Description | Trigger |
|-----|-------------|---------|
| **Build** | Installs dependencies, builds the project, uploads artifact | Automatic |
| **Staging** | Deploys to staging environment via Pulumi | Automatic after Build |
| **Production** | Deploys to production environment via Pulumi | Requires environment approval |

### Approving Production Deployment

When staging completes, the Production job waits for approval:

1. Go to the workflow run in GitHub Actions
2. Click "Review deployments"
3. Select "Production" and approve

Or via CLI:
```bash
# List pending runs
gh run list --status waiting

# Approve via web UI
gh run view <run-id> --web
```

### Triggers

- **Push to master**: Runs the full pipeline
- **Daily schedule (2 AM UTC)**: Ensures staging/production stay in sync

### Files

- `.github/workflows/continuous_deployment.yaml` - Main deployment workflow
- `.github/actions/compute-issues-to-deploy/action.yml` - Gathers issues from commits and status column
- `.github/actions/sync-issues-status/action.yml` - Moves issues to a specified status column
- `.github/actions/track-cycle-time/action.yml` - Computes cycle time from issue history

---

## GitHub Project

We use a Kanban board to track issues:

**Project URL**: https://github.com/users/godu/projects/2

### Status Columns

| Column | Description |
|--------|-------------|
| **Backlog** | Issues waiting to be worked on |
| **Todo** | Planned for soon |
| **In Progress** | Currently being worked on |
| **In Review** | Pull request open, awaiting review |
| **Deployed in Staging** | Live on staging, awaiting production approval |
| **Deployed in Production** | Live in production |

### Project Workflows (Built-in Automations)

| Workflow | Status | Description |
|----------|--------|-------------|
| **Auto-add to project** | Enabled | Automatically adds new issues/PRs to the project |
| **Auto-add sub-issues to project** | Enabled | Automatically adds sub-issues when parent is in project |
| **Auto-archive items** | Enabled | Archives items after they're closed for a period |
| **Item added to project** | Enabled | Sets initial status when item is added |
| **Pull request linked to issue** | Enabled | Updates issue when PR is linked |
| **Item closed** | Disabled | Not used - deployment automation handles transitions |
| **Pull request merged** | Disabled | Not used - deployment automation handles transitions |

---

## Issue Workflow

### Manual Transitions

You move issues manually through these columns as you work:

```
Backlog → Todo → In Progress → In Review
```

### Automated Transitions

When you merge a PR that closes an issue, the automation takes over:

```
In Review → Deployed in Staging → Deployed in Production
            (after staging)       (after production)
```

**Staging deployment:**
1. Computes issues to deploy (from commit messages: `fix #123`, `close #123`, etc.)
2. Moves those issues to "Deployed in Staging"

**Production deployment:**
1. Computes issues to deploy (from commits + all issues in "Deployed in Staging")
2. Moves all computed issues to "Deployed in Production"
3. Computes cycle time for those issues

> **Why include Staging issues?** With `cancel-in-progress` concurrency, if you push `fix #1` then quickly push `fix #2`, the first workflow gets canceled. When you approve production for the second workflow, both #1 and #2 are promoted because they're both computed in the same batch.

---

## Closing Issues via Commits

To automatically close an issue and trigger the Kanban automation, include one of these keywords in your commit message:

| Keyword | Example |
|---------|---------|
| `fix` | `fix #42` |
| `fixes` | `fixes #42` |
| `fixed` | `fixed #42` |
| `close` | `close #42` |
| `closes` | `closes #42` |
| `closed` | `closed #42` |
| `resolve` | `resolve #42` |
| `resolves` | `resolves #42` |
| `resolved` | `resolved #42` |

### Example Commit Message

```
Add dark mode toggle

Implements theme switching with system preference detection.

fix #42
```

When this commit is pushed to master:
1. GitHub closes issue #42
2. Staging deploys → issue moves to "Deployed in Staging"
3. You approve production → issue moves to "Deployed in Production"

---

## Cycle Time Tracking

We automatically track how long issues take from "In Progress" to production deployment.

### Custom Field

| Field | Type | Description |
|-------|------|-------------|
| **Cycle Time** | Number | Duration in days from "In Progress" to "Deployed in Production" |

### How It Works

At production deployment, the automation:
1. Receives the list of issues being deployed (from the compute step)
2. For each issue, queries its timeline history (`ProjectV2ItemStatusChangedEvent`)
3. Finds when the issue first moved to a work column (In Progress, In Review, etc.)
4. If the issue was moved back to Backlog/Todo, the timer resets
5. Calculates the number of days from start to now (2 decimal precision)
6. Sets the "Cycle Time" field (skips if already set)

```
┌───────────────────────────────────────────────────────────────────┐
│  Todo → In Progress     │  Timestamp recorded in issue history   │
│  (you move manually)    │  (automatic by GitHub)                 │
├───────────────────────────────────────────────────────────────────┤
│  In Progress → Backlog  │  Timer resets (issue went back)        │
│  (if moved back)        │                                        │
├───────────────────────────────────────────────────────────────────┤
│  → Deployed in Prod     │  Cycle Time computed from history      │
│  (after approval)       │  (via track-cycle-time action)         │
└───────────────────────────────────────────────────────────────────┘
```

### Viewing Cycle Time

In the GitHub Project, create a view with:
- **Filter**: `Status:Deployed in Production`
- **Sort**: `Cycle Time` (ascending for fastest, descending for slowest)
- **Columns**: Title, Cycle Time

### Files

- `.github/actions/compute-issues-to-deploy/action.yml` - Gathers issues from commits and status column
- `.github/actions/sync-issues-status/action.yml` - Moves issues to a specified status column
- `.github/actions/track-cycle-time/action.yml` - Computes cycle time from issue history
