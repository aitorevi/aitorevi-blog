---
title: "Vercel preview deployments: use them, share them, keep things clean"
description: "Every branch you push to Vercel automatically gets a public URL. Here's how to get the most out of it and how to clean up what accumulates."
publishDate: 2026-04-14
tags:
  - Vercel
  - DevOps
  - CLI
draft: true
featured: false
author:
  name: aitorevi
  avatar: /avatar.webp
---

When you connect a Vercel project to GitHub, two things happen:

1. Every push to `main` (or `master`) deploys to production.
2. Every push to **any other branch** deploys to a temporary public URL.

That second one is a _preview deployment_. Vercel creates it automatically, no configuration needed. The URL looks like this:

```
https://your-project-abc123xyz-your-team.vercel.app
```

It's not production. It has `noindex`, so it won't show up in search engines. Nobody stumbles upon it by accident. But it's a real, public, accessible URL.

## What it's useful for

The most common case: you finish a feature on a branch, you're not ready to merge yet, but you need someone to review it in a real environment.

```bash
git push origin feat/new-form
```

Vercel creates the preview automatically. The URL appears in the dashboard or in the GitHub PR bot. You share it, get feedback, push fixes, the URL updates.

It also works for simpler things: checking how something looks on mobile without setting anything up, or testing in a production-like environment before touching `master`.

## How to list them

If you have the Vercel CLI installed:

```bash
npm i -g vercel   # if you don't have it yet
vercel login
vercel ls
```

The output shows all deployments with their status, environment and age:

```
Age     Deployment                                          Status    Environment
1h      https://my-blog-abc123-team.vercel.app              ● Ready   Production
5h      https://my-blog-def456-team.vercel.app              ● Ready   Preview
14h     https://my-blog-ghi789-team.vercel.app              ● Error   Preview
```

Three relevant states:
- **Production**: the one behind your real domain. Don't touch it.
- **Preview**: test branch. Delete when you no longer need it.
- **Error**: failed build. Always safe to delete.

If you have many deployments, `vercel ls` paginates in groups of 20:

```bash
vercel ls --next <cursor>   # the output gives you the cursor
```

## How to delete a specific one

```bash
vercel remove https://my-blog-def456-team.vercel.app --yes
```

The `--yes` flag skips the interactive confirmation. Useful inside scripts.

You can also pass several at once:

```bash
vercel remove \
  https://my-blog-def456-team.vercel.app \
  https://my-blog-ghi789-team.vercel.app \
  --yes
```

## Cleaning all previews at once

If you haven't cleaned up in a while, dozens can accumulate. Instead of deleting them one by one, this loop removes them all in successive passes:

```bash
while true; do
  URLS=$(vercel ls 2>&1 | grep -E "Preview|Error" | grep -oE 'https://[^ ]+')
  if [ -z "$URLS" ]; then
    echo "Nothing left to clean."
    break
  fi
  echo "$URLS" | xargs vercel remove --yes
  sleep 1
done
```

How it works:
1. Lists deployments and filters Preview and Error ones.
2. Deletes them in bulk.
3. Repeats until none are left (since `vercel ls` paginates, each iteration surfaces the next batch).

## Preventing accumulation

The root cause is that Vercel stores all deployments indefinitely by default. You can change that:

1. Go to the Vercel dashboard → your project → **Settings** → **Git**.
2. Find the **Deployment Retention** section.
3. Set how many days you want to keep previews before they're automatically deleted.

With that configured, you never need to clean up manually again.

## Summary

| What you want to do | Command |
|---|---|
| List all deployments | `vercel ls` |
| Delete one | `vercel remove <url> --yes` |
| Delete several | `vercel remove <url1> <url2> --yes` |
| Clean all previews | Loop with `grep` + `xargs` above |
| Prevent accumulation | Deployment Retention in Settings → Git |

Preview deployments are a genuinely useful tool. The problem isn't using them — it's forgetting they exist until you have fifty piled up. With automatic retention configured, they stop being a problem.
