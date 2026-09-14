# 0.1.0-alpha.4

- 鼠标操作图表不触发整块焦点框，键盘仍有可见焦点。

# Changelog

## 0.1.0-alpha.3

- 修复环形图中心总数穿透 tooltip 的层级问题；浮层始终绘制在总数之上。
- 图形进入与数据更新采用 220ms 局部透明度过渡，tooltip 使用 120ms 淡入；数值与几何位置直接呈现真实数据。
- 新增 `motion` 开关；跟随系统减少动态效果偏好并取消进行中的过渡，更新保留键盘焦点。

## 0.1.0-alpha.1

- First independently installable MDS chart package: line, area, grouped and stacked bars, stacked areas and donuts.
- Shared theme typography, six semantic series tokens, subdued grids, localizable axes, exact-value tooltips and donut totals.
- Named figures and native expandable, scrollable data tables with missing-value labels.
- Responsive layout; empty data, single observations, negative Cartesian values and invalid donut inputs handled explicitly.
- No data-drawing animations; local disclosure feedback respects reduced motion.

## 0.1.0-alpha.2

- 图表采用六色分类调色板，不把状态告警与类别混用。
- 使用 UI 的 data-1…6 token；旧版 UI 保留原颜色 fallback。
