# Four-Level Framework Data Contract

This document defines the shared contract for `data/four-level-framework.json`.

## Scope

- Level 1: Country strategic posture (mapped to `data/demo.json`).
- Level 2: Sector priority mapping (`competitiveness`, `aiPenetration`, `opportunity`).
- Level 3: Enterprise/SME assessment (`dimensions`, `modes`, indicator sets).
- Level 4: Lighthouse feasibility (`technicalReadiness`, `socialReadiness`, metrics, evidence).

## Scoring Rules

- Level 2
  - Inputs are normalized to 0-100.
  - Quadrants:
    - `x >= 50` and `y >= 50`: High-Reward / Low-Risk.
    - `x < 50` and `y >= 50`: High-Reward / High-Risk.
    - `x >= 50` and `y < 50`: Selective / Defend.
    - Else: Low Immediate Priority.
- Level 3
  - Each indicator is scored on 0-5.
  - Dimension weighted score contribution is `(dimensionAverage / 5) * dimensionWeight`.
  - Total maturity score is the rounded sum of weighted contributions (0-100).
  - Maturity bands:
    - Foundational: 0-20
    - Emerging: 21-40
    - Scaling: 41-60
    - Frontier: 61-80
    - Strategic Impact: 81-100
- Level 4
  - Each readiness sub-dimension is scored on 0-100.
  - Composite readiness is the arithmetic mean of technical + social sub-dimensions.

## Level Handoff

- L1 -> L2: user selects country context.
- L2 -> L3: selected country + sector becomes assessment context.
- L3 -> L4: maturity output informs project readiness focus.
- L4 -> detailed case page: link to `level4/index.html?case=<country-slug>`.

## Minimal Validation Checklist

- Required keys exist: `metadata`, `scoreBands`, `level2`, `level3`, `level4`.
- All scores are numeric and in expected range.
- Level 3 dimension weights total 100.
- Evidence links use absolute URLs.

