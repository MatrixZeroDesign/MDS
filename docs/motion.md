# Motion

Motion explains state changes and provides tactile feedback. It is not background decoration.

| Token                 |                  Default | Use                                   |
| --------------------- | -----------------------: | ------------------------------------- |
| --mds-duration-fast   |                    120ms | Menus, checkmarks, hover              |
| --mds-duration-normal |                    180ms | Switch, Dialog, state entry           |
| --mds-duration-slow   |                    240ms | Reserved for future complex expansion |
| --mds-ease-out        | cubic-bezier(.16,1,.3,1) | Quick entry and gentle stop           |
| --mds-ease-switch     | cubic-bezier(.2,.8,.2,1) | Switch sliding                        |

SideSheet and NavDrawer enter from their edge in 240ms. Collapse expands by content height. Menus move only themselves by 3px, and Dialog moves only itself by 6px. Do not scale the whole page, translate the background, or add bouncy effects. Buttons use color feedback instead of changing layout size on press.

Loading uses an explicit busy state; decorative motion is never the only state signal. Progress retains its progressbar value, Switch and Checkbox expose their real checked state, and steps use `aria-current`.

When `prefers-reduced-motion: reduce` is active, disable animation and transitions while preserving every state and interaction. Theme switching does not animate the whole page. Browser tests cover reduced-motion behavior for menus and switches.
