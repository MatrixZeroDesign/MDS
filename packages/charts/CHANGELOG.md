# 0.1.0-alpha.4

- Pointer interaction no longer triggers a focus outline around the entire chart; keyboard focus remains visible.

# Changelog

## 0.1.0-alpha.3

- Fixed donut center totals appearing above tooltips; the overlay is always rendered above the total.
- Chart entry and data updates use a local 220ms opacity transition; tooltips fade in over 120ms while values and geometry reflect committed data immediately.
- Added the `motion` switch; it follows reduced-motion preferences, cancels active transitions and preserves keyboard focus across updates.

## 0.1.0-alpha.1

- First independently installable MDS chart package: line, area, grouped and stacked bars, stacked areas and donuts.
- Shared theme typography, six semantic series tokens, subdued grids, localizable axes, exact-value tooltips and donut totals.
- Named figures and native expandable, scrollable data tables with missing-value labels.
- Responsive layout; empty data, single observations, negative Cartesian values and invalid donut inputs handled explicitly.
- No data-drawing animations; local disclosure feedback respects reduced motion.

## 0.1.0-alpha.2

- Charts use a six-color categorical palette instead of mixing status alerts with categories.
- Charts use the UI data-1…6 tokens, with legacy color fallbacks for older UI versions.
