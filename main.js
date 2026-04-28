'use strict';

const { Plugin } = require('obsidian');

const ROWS_FROM_BOTTOM = 8;

class CursorScrollOffPlugin extends Plugin {
  async onload() {
    this.registerDomEvent(document, 'keyup', (e) => {
      const isArrow = e.key === 'ArrowUp' || e.key === 'ArrowDown';
      // j/k without modifiers covers vim normal/visual mode movement
      const isVimNav = !e.ctrlKey && !e.altKey && !e.metaKey &&
                       (e.key === 'j' || e.key === 'k');
      if (isArrow || isVimNav) {
        this.applyScrollOffset();
      }
    }, true);
  }

  applyScrollOffset() {
    const cm = this.app.workspace.activeLeaf?.view?.editor?.cm;
    if (!cm) return;

    const head = cm.state.selection.main.head;
    const coords = cm.coordsAtPos(head);
    if (!coords) return;

    const scrollEl = cm.scrollDOM;
    const editorRect = scrollEl.getBoundingClientRect();
    // defaultLineHeight gives one visual row's height in pixels
    const margin = cm.defaultLineHeight * ROWS_FROM_BOTTOM;

    const distFromBottom = editorRect.bottom - coords.bottom;
    if (distFromBottom < margin) {
      scrollEl.scrollTop += margin - distFromBottom;
    }
  }
}

module.exports = CursorScrollOffPlugin;
