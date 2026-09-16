# Design and accessibility

## Choosing a component

| Intent                  | Component                      | Reason                                 |
| ----------------------- | ------------------------------ | -------------------------------------- |
| Submit a value          | Select                         | Consistent listbox with form semantics |
| Choose a preference     | ChoiceMenu or SegmentedControl | Menu/radio selection                   |
| Switch content          | Tabs                           | Associated panels                      |
| Navigate to URL         | NavLink                        | Real anchor                            |
| Perform action          | Button or DropdownItem         | Action semantics                       |
| Immediate boolean       | Switch                         | Stable on/off preference               |
| Selection before submit | Checkbox                       | Independent selection                  |
| Focused short task      | Dialog                         | Modal focus                            |
| Contextual details      | SideSheet                      | More vertical space                    |
| Explain optional detail | Tooltip                        | Noninteractive short text              |

## Color and typography

Use semantic pairs: --mds-text on --mds-surface; --mds-accent with --mds-on-accent; status foregrounds with their matching --mds-\*-bg. Reserve status colors for meaning. Charts use --mds-chart-1 through --mds-chart-6, which inherit --mds-data-1 through --mds-data-6. Do not assume accent text works on every background.

The font stack separates --mds-font-latin, --mds-font-cjk and --mds-font-mono. Supply locally available or explicitly bundled licensed fonts. Test real Chinese and English together, long labels, numerals and fallback glyphs. MDS never downloads fonts at runtime. Set the document lang to the actual interface language and translate labels, errors and close actions.

## Motion

Use --mds-duration-fast (120ms), --mds-duration-normal (180ms) and --mds-duration-slow (240ms) when extending local component motion. Existing components use brief local transitions (120–240ms) and respect prefers-reduced-motion. Do not animate the page behind a menu or scale the background. Chart data should appear without interpolating values.

## Keyboard and focus

Keep visible focus indicators. Use actual buttons/links, name controls, preserve Radix keyboard handlers and avoid nested interactive elements. A Dialog/SideSheet normally returns focus to its Trigger. For programmatic opening without a Trigger, store the exact opener and restore it in onCloseAutoFocus:

```tsx
onCloseAutoFocus={(event) => {
  event.preventDefault();
  openerRef.current?.focus();
}}
```

The opener must remain mounted and enabled. If it disappears, focus a stable control near the completed task. Never move focus to body as the default recovery strategy.

## Acceptance

Validate zh/en, light/dark/system, multiple theme roots, reduced motion, keyboard-only usage and 320px layouts. Check loading/error/empty/disabled states, real API latency and native form reset. A static preview does not validate behavior. For charts, inspect exact-value tables and missing data, and retain both labels and colors.

## Contrast acceptance

Use WCAG 2.2 AA thresholds: normal text at least 4.5:1; large text at least 3:1; essential control boundaries, states and graphical information at least 3:1 against adjacent colors. Large text means at least 24 CSS px, or approximately 18.67px bold. Do not round a failing ratio upward.

Ordinary dividers use --mds-border; control outlines use --mds-control-border. Test real foreground/background pairs, including placeholders, descriptions, hover and focus in both themes. Color must not be the only way to distinguish a state. Automated Axe and contrast checks are regression gates, not a claim that every possible consumer composition is accessible.

Sources: [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
