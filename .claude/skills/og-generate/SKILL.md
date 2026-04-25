---
name: og-generate
description: Generates all OG images (og-image.png and og-katas.png) and verifies the output
userInvocable: true
---

# og-generate

Genera las Open Graph images estáticas del proyecto.

## Steps

1. Run `node scripts/generate-og-image.mjs` → produces `public/og/og-image.png` (1200×630)
2. Run `node scripts/generate-og-katas.mjs` → produces `public/og/og-katas.png` (1200×630)
3. Verify both files exist and are non-zero size with `ls -lh public/og/`
4. Remind the user to commit the generated PNGs

## Notes

- Requires internet access to fetch fonts from jsdelivr (pinned to @5.2.8)
- Requires `scripts/assets/avatar-og.png` to exist (PNG copy of the avatar for satori)
- Output files are committed to the repo — they are static assets, no runtime cost
