---
name: update-alumni
description: |
  Find the latest professional position (company, school, lab, title) of the lab's
  alumni and suggest updates to their entries in data.yml. Use when the user wants
  to refresh alumni info, check where alumni are now, or update the alumni list on
  the group website.
allowed-tools:
  - Read
  - Edit
  - WebSearch
  - AskUserQuestion
---

# Update Alumni Positions

Refresh the `alumni` entries in `data.yml` with each person's current professional
position by searching the web.

## How alumni are stored

`data.yml` has an `alumni:` list. Each entry looks like:

```yaml
  - name: 🎓 Dr. Bruce Liu
    role: Research Scientist @ Adobe
    expertise: HCI x AI
    img: Bruce_n.jpg
    imgalt: Bruce_f.jpg
    url: https://liubruce.me/
```

Only `role` (and occasionally `expertise`) reflects where someone currently is.
`role` is the field that captures their present position — often phrased as a title
`@ Company`, `Now PhD @ School`, `Postdoc @ School`, `Now MHCI @ CMU`, etc. Keep the
existing phrasing style when proposing changes. Never touch `img`, `imgalt`, the
`🎓 Dr.` prefix, or the ordering (Dr.'s stay at the top — see [[alumni-drs-first]]).

## Steps

1. **Read** the `alumni:` list from `data.yml` and collect each person's `name`
   (strip the `🎓 Dr. ` prefix for searching), current `role`, `expertise`, and any
   `url`.

2. **Search** for each alum's current position. Run searches in parallel where
   possible. Good queries:
   - `"<full name>" <known affiliation or field> LinkedIn`
   - `"<full name>" <field> current position 2026`
   - If they have a `url` (personal site / LinkedIn / Scholar), factor it in.
   Prefer authoritative, recent sources: LinkedIn, personal homepages, university
   or company pages, Google Scholar. Names are common — cross-check the field
   (HCI, AI, the person's prior affiliation) to make sure you found the right person.

3. **Compare** the found position against the current `role`. Only flag an entry
   when you have a confident, sourced update that differs from what's there. Match
   the existing phrasing convention (e.g. `Now PhD @ <School>`, `<Title> @ <Company>`).

4. **Present** proposed changes as a table before editing: name, current role,
   proposed role, and the source URL you based it on. Separate confident updates
   from low-confidence guesses. Do NOT edit entries where you couldn't confirm
   anything — leave them as-is and say so.

5. **Confirm then apply.** Use AskUserQuestion (or a plain list if many) to let the
   user pick which updates to apply, then make the `Edit`s to `data.yml`. When
   someone earns a doctorate, adding the `🎓 Dr. ` prefix and moving them to the top
   Dr. block is a valid suggestion — call it out explicitly rather than doing it
   silently.

## Notes

- Be conservative: a wrong "current position" is worse than a stale one. When
  sources conflict or the identity is ambiguous, report the uncertainty instead of
  guessing.
- Always cite the source URL for each proposed change so the user can verify.
- Don't invent positions or infer beyond what a source states.
