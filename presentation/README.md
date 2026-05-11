# Mallah Presentation Generator

This folder contains the generated graduation-deck deliverables for Mallah.

## What it produces

- `output/Mallah_Award_Winning_Graduation_Deck.pptx`
- `output/Mallah_Award_Winning_Graduation_Deck.md`

## Regenerate

```powershell
python presentation/generate_mallah_award_deck.py
```

## Optional screenshot workflow

The generator is screenshot-aware.

If you add any of these files to `presentation/assets/`, the deck will place them automatically:

- `landing.png`
- `dashboard.png`
- `roadmap.png`
- `portfolio.png`
- `resume-builder.png`
- `opportunity-analyzer.png`
- `tracker.png`
- `admin-panel.png`

If an asset is missing, the deck uses a polished placeholder frame so the presentation remains usable.
