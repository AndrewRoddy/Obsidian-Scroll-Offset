'use strict';

const { Plugin } = require('obsidian');

const ROWS_FROM_BOTTOM = 8;

class CursorScrollOffPlugin extends Plugin {
  async onload() {
    this._rafPending = false;

    // Bubble phase so CM6 processes the key first (moves the cursor in state),
    // then we schedule a RAF. CM6 also schedules a RAF to update the DOM.
    // Since CM6's RAF was queued before ours, it fires first — so by the time
    // our RAF runs, coordsAtPos reflects the new cursor position.
    this.registerDomEvent(document, 'keydown', (e) => {
      const isArrow = e.key === 'ArrowUp' || e.key === 'ArrowDown';
      const isVimNav = !e.ctrlKey && !e.altKey && !e.metaKey &&
                       (e.key === 'j' || e.key === 'k');
      if (isArrow || isVimNav) {
        this.scheduleScrollCheck();
      }
    });
  }

  scheduleScrollCheck() {
    if (this._rafPending) return;
    this._rafPending = true;
    requestAnimationFrame(() => {
      this._rafPending = false;
      this.applyScrollOffset();
    });
  }

  applyScrollOffset() {
    const cm = this.app.workspace.activeLeaf?.view?.editor?.cm;
    if (!cm) return;

    const head = cm.state.selection.main.head;
    const coords = cm.coordsAtPos(head);
    if (!coords) return;

    const scrollEl = cm.scrollDOM;
    const editorRect = scrollEl.getBoundingClientRect();
    const margin = cm.defaultLineHeight * ROWS_FROM_BOTTOM;

    const distFromBottom = editorRect.bottom - coords.bottom;
    if (distFromBottom < margin) {
      scrollEl.scrollTop += margin - distFromBottom;
    }
  }
}

module.exports = CursorScrollOffPlugin;
