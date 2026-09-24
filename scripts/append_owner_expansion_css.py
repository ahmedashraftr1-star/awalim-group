import sys

owner_expansion_css = '''
/* ==========================================================================
   SOVEREIGN OWNER EXPANSION: FLOW, MILESTONES, WORKFORCE & CMD PALETTE
   ========================================================================== */

/* Cashflow Visualizer */
.dash-flow-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-block-end: var(--space-4);
}
@media (max-width: 768px) {
  .dash-flow-grid { grid-template-columns: 1fr; }
}
.dash-flow-stat {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.dash-flow-bar-wrap {
  display: flex;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  gap: 2px;
  background: rgba(255, 255, 255, 0.05);
  margin-block: var(--space-3);
}
.dash-flow-seg {
  height: 100%;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dash-flow-seg:hover {
  opacity: 0.85;
  transform: scaleY(1.2);
}

/* Strategic Milestones Roadmap */
.dash-milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: var(--space-4);
}
.dash-milestone-card {
  background: linear-gradient(145deg, rgba(20, 25, 36, 0.75) 0%, rgba(10, 13, 20, 0.85) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-3);
  position: relative;
  overflow: hidden;
}
.dash-milestone-card--done {
  border-color: rgba(16, 185, 129, 0.35);
}
.dash-milestone-progress {
  inline-size: 100%;
  block-size: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.dash-milestone-bar {
  block-size: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #00F0FF, #10B981);
}

/* Workforce Grid */
.dash-workforce-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: var(--space-3);
}
.dash-workforce-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Command Palette (Cmd+K) Modal */
.dash-cmd-palette {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-block-start: clamp(60px, 15vh, 140px);
  padding-inline: var(--space-4);
  background: rgba(4, 6, 10, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  animation: cmd-fade-in 0.15s ease-out;
}
@keyframes cmd-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.dash-cmd-card {
  inline-size: 100%;
  max-inline-size: 680px;
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, rgba(24, 29, 44, 0.96) 0%, rgba(12, 16, 26, 0.98) 100%);
  border: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.dash-cmd-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-block-end: 1px solid rgba(255, 255, 255, 0.08);
}
.dash-cmd-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: var(--fs-base);
  color: var(--text-1);
  outline: none;
  font-family: inherit;
}
.dash-cmd-input::placeholder {
  color: var(--text-muted);
}
.dash-cmd-body {
  max-block-size: 380px;
  overflow-y: auto;
  padding: var(--space-2);
}
.dash-cmd-group-title {
  font-size: var(--fs-xs);
  color: var(--text-muted);
  padding: var(--space-2) var(--space-3);
  font-weight: var(--w-bold);
  text-transform: uppercase;
}
.dash-cmd-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  color: var(--text-2);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  user-select: none;
}
.dash-cmd-item:hover, .dash-cmd-item.active {
  background: rgba(0, 240, 255, 0.12);
  color: var(--text-1);
}
.dash-cmd-item-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.dash-cmd-icon {
  inline-size: 18px;
  block-size: 18px;
  display: grid;
  place-items: center;
  color: var(--accent);
}
.dash-cmd-badge {
  font-size: 0.72rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  color: var(--text-muted);
}
.dash-cmd-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-5);
  border-block-start: 1px solid rgba(255, 255, 255, 0.08);
  font-size: var(--fs-xs);
  color: var(--text-muted);
  background: rgba(0, 0, 0, 0.2);
}
'''

p = '/Users/ahmedashraf/Awalim-Group-Site/src/css/pages.css'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

if '.dash-cmd-palette' not in c:
    c += '\n' + owner_expansion_css
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Appended Owner Expansion CSS successfully')
else:
    print('Already present')
