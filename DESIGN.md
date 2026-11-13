# PinballHEIR Design Brief

**Tone**: Retro-futuristic arcade gaming — bold, immersive, neon-lit. DAO-governed pinball platform with premium gaming feel and electric energy.

**Differentiation**: Neon glow effects on interactive elements, arcade-cabinet-inspired UI layering, pixel-perfect typography, high-contrast score displays, DAO governance overlays.

## Palette (OKLCH)

| Role | L | C | H | Usage |
| --- | --- | --- | --- | --- |
| Background | 0.145 | 0 | 0 | Page base, deep void |
| Card | 0.205 | 0 | 0 | Elevated surfaces, table cards |
| Foreground | 0.985 | 0 | 0 | Text, iconography |
| Primary (Purple) | 0.7 | 0.25 | 280 | CTAs, neon borders, active states |
| Accent (Cyan) | 0.65 | 0.28 | 180 | Highlights, special features, scores |
| Destructive | 0.704 | 0.191 | 22.216 | Error, warnings, special events |
| Muted | 0.269 | 0 | 0 | Secondary text, disabled states |

## Typography

| Tier | Font | Role |
| --- | --- | --- |
| Display | Space Grotesk (700) | Headings, table names, score labels |
| Body | Plus Jakarta Sans (400/700) | Content, forms, UI labels |
| Mono | JetBrains Mono (400) | Scores, ledger data, timestamps |

## Structural Zones

| Zone | Treatment | Border | Bg |
| --- | --- | --- | --- |
| Game viewport | Arcade cabinet frame, centered, elevated | `arcade-border` (2px primary) | `card` |
| Table constructor (9-tab) | Sidebar or modal tabs: Layout, Visuals, Physics, Economy, Ruleset, Metadata, Access, DAO Settings, Preview | `arcade-tab-active` on selected, `arcade-border-accent` for interactive hover | `popover` |
| Constructor panels | Form sections within each tab | `arcade-border-accent` on focus, `construction-zone` wrapper | `background` |
| Leaderboard | Mono font scores, condensed rows | Subtle accent underline | `background` |
| Header / navigation | Sidebar or top bar, logo + wallet | `sidebar-border` | `sidebar` |
| Modal / governance | Overlay, proposal votes, rule editor, voting interface | Cyan accent frame `arcade-border-active`, `govenance-badge` for voting power | `popover` |
| Score tickers | Floating badges, animations on update | `neon-cyan-active` shadow | `card` / transparent |
| NFT Marketplace | Grid or carousel of skins | `arcade-card-interactive` per item | `background` |

## Spacing & Rhythm

Grid: 4px base. Density: compact gameplay zone, moderate spacer between sections. Breathing room for table selector and leaderboard.

## Component Patterns

- **Buttons**: CTA (primary glow), secondary (muted), destructive (red). Neon border on hover, arcade-tab active state.
- **Inputs**: Cyan border on focus, mono font for numeric fields. arcade-inset shadow for input depth.
- **Cards**: Layered depth (arcade-depth shadow), primary/accent borders, hover glow effect. arcade-card wrapper.
- **Score display**: Large mono font (JetBrains), accent color, pulse animation on change. score-large for big displays.
- **Governance UI**: Proposal cards with vote tallies, cyan highlights for active votes. govenance-badge for voting weight.
- **Tab system**: arcade-tab base state, arcade-tab-active for selected tabs. Cyan glow on hover. tab-slide animation on load.
- **Constructor panels**: construction-zone for form sections. lever-control for individual settings.

## Motion

- **Pulse neon**: 2s loop, primary color glow intensity fade (buttons, active states).
- **Bounce subtle**: 3s loop, 4px upward translate (floating score badges).
- **Glow pulse**: 2.5s loop, cyan accent intensity cycling (active votes, governance highlights).
- **Score tick**: 0.4s scale bounce + opacity lock (score updates).
- **Tab slide**: 0.3s fade + translate (tab panel entry).
- **Transitions**: 0.2s ease-out for interactive elements (buttons, hovers, modals).

## Signature Detail

**Arcade cabinet bezels**: 0.625rem radius on all card-like elements mimics pinball machine construction. Neon glows on every interactive element reinforce the electric arcade vibe. Score displays in monospace track in-game metrics with precision. DAO proposal overlays in cyan signal platform governance and player empowerment.

**9-Tab Table Constructor**: Tabbed interface (Layout → Visuals → Physics → Economy → Ruleset → Metadata → Access → DAO Settings → Preview) each with cyan borders on focus, purple primary glow on active tab. Drag-and-drop zones within each tab marked by construction-zone wrapper. Lever controls for sliders/toggles. Tab transitions slide in with fade-in animation.

**Governance Voting UI**: Proposal cards display vote tallies with govenance-badge for voting power. Active votes pulse cyan (glow-pulse animation). Voting outcomes marked by neon-cyan-active shadow on finalized proposals. Score disputes and DAO rule changes trigger governance badges + voting UI.

## Constraints

- All colors via CSS variables (OKLCH). No hardcoded hex/rgb.
- High contrast for accessibility (AA+). Cyan accent on dark bg = 0.65 vs 0.145 = 0.52 L difference.
- Neon glows are subtle (0.5 opacity outer, 0.25 inner) — never garish or disorienting.
- Arcade-feel texture through layered shadows and border treatments, never via background images.
- Responsive: Mobile-first design, card stack on small screens, grid layout on lg+.
- Physics/game viewport scales with container, game logic untouched.
