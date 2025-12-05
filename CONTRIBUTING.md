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
| **Staging** | Deploys to staging environment via Pulumi, invalidates CloudFront cache | Automatic after Build |
| **Production** | Deploys to production environment via Pulumi, invalidates CloudFront cache | Manual approval required |

### Triggers

- **Push to master**: Runs the full pipeline
- **Daily schedule (2 AM UTC)**: Ensures staging/production stay in sync

### Files

- `.github/workflows/continuous_deployment.yaml` - Main workflow
- `.github/actions/move-issues-to-status/action.yml` - Reusable action for Kanban automation

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

The automation:
1. Parses commit messages for issue references
2. Moves referenced issues to "Deployed in Staging" after staging deployment
3. Moves them to "Deployed in Production" after production deployment

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
