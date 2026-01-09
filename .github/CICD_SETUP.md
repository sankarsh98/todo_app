# GitHub CI/CD Setup Guide

This guide explains how to set up automated deployments for TaskFlow using GitHub Actions.

## Overview

The repository includes three automated workflows:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **firebase-deploy.yml** | Push to `main` | Auto-deploy to production |
| **firebase-preview.yml** | Pull Request | Deploy preview for testing |
| **feature-deploy.yml** | Issue closed with labels | Deploy when feature approved |

---

## 🔧 Initial Setup

### 1. Create Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to **Project Settings** → **Service Accounts**
3. Click **Generate new private key**
4. Download the JSON file

### 2. Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `FIREBASE_SERVICE_ACCOUNT` | Paste the entire JSON content from step 1 |
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | your-project-id |
| `VITE_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |

### 3. Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. Click **"I understand my workflows, go ahead and enable them"**

---

## 🚀 Workflow Details

### Auto-Deploy on Push

**File:** `.github/workflows/firebase-deploy.yml`

Whenever code is pushed to the `main` branch:
1. Checks out code
2. Installs dependencies
3. Builds the project
4. Deploys to Firebase Hosting

**Manual Trigger:** You can also trigger this manually from the Actions tab using "workflow_dispatch".

### Preview Deployments

**File:** `.github/workflows/firebase-preview.yml`

Whenever a Pull Request is opened:
1. Builds the PR changes
2. Deploys to a preview channel
3. Posts preview URL as a comment

This allows reviewers to test changes before merging.

### Feature-Based Deployment

**File:** `.github/workflows/feature-deploy.yml`

This is the automated issue-based deployment:

1. Create an issue using the **Feature Request** template
2. Develop the feature in a branch
3. Create a PR and merge to `main`
4. Add the `approved` label to the issue
5. Close the issue
6. **Deployment automatically triggers!**

The workflow:
- Checks if issue has both `feature` AND `approved` labels
- Builds and deploys to production
- Posts a success comment on the issue

---

## 🏷️ Required Labels

Create these labels in your repository:

| Label | Color | Description |
|-------|-------|-------------|
| `feature` | `#0E8A16` (green) | New feature request |
| `approved` | `#1D76DB` (blue) | Feature approved for deployment |
| `bug` | `#D73A4A` (red) | Bug report |
| `needs-review` | `#FBCA04` (yellow) | Needs maintainer review |
| `needs-triage` | `#E99695` (pink) | Needs investigation |

---

## 📋 Issue Templates

Two issue templates are included:

### Feature Request (`feature_request.yml`)
- Description
- Use case
- Implementation suggestions
- Priority level
- Category

### Bug Report (`bug_report.yml`)
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Device/browser info
- Screenshots

---

## 🔄 Typical Workflow

1. **User submits feature request** → Issue created with `feature` + `needs-review` labels

2. **Maintainer reviews** → 
   - If approved: Add `approved` label, assign to developer
   - If rejected: Close with explanation

3. **Developer implements** →
   - Create branch from `main`
   - Make changes
   - Open PR referencing issue (e.g., "Fixes #123")

4. **PR reviewed and merged** → Auto-deploys to production via `firebase-deploy.yml`

5. **Close the issue** → With `feature` + `approved` labels, triggers `feature-deploy.yml`

6. **Success comment posted** → Issue shows deployment confirmation

---

## 🔒 Security Notes

- Never commit secrets to the repository
- Keep `FIREBASE_SERVICE_ACCOUNT` JSON private
- Use environment secrets, not repository variables for sensitive data
- Preview deployments only run for PRs from the same repository (not forks)

---

## 🛠️ Troubleshooting

### Build fails
- Check if all secrets are set correctly
- Verify Node.js version matches (v20)
- Check build output for missing dependencies

### Deploy fails
- Verify Firebase service account has required permissions
- Check project ID matches
- Ensure Hosting is enabled in Firebase Console

### Preview not posting
- Check if PR is from a fork (disabled by default)
- Verify `GITHUB_TOKEN` has write permissions

---

## 📚 Resources

- [Firebase Hosting Action](https://github.com/FirebaseExtended/action-hosting-deploy)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
