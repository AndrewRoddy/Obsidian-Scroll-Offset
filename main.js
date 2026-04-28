'use strict';

const { Plugin } = require('obsidian');

const ROWS = 8;

class CursorScrollOffPlugin extends Plugin {
  async onload() {
    this.registerDomEvent(document, 'keydown', (e) => {
      const noMod = !e.ctrlKey && !e.altKey && !e.metaKey;
      if (e.key === 'ArrowDown' || (noMod && e.key === 'j')) {
        queueMicrotask(() => requestAnimationFrame(() => this.adjust('down')));
      } else if (e.key === 'ArrowUp' || (noMod && e.key === 'k')) {
        queueMicrotask(() => requestAnimationFrame(() => this.adjust('up')));
      }
    }, true); // capture phase: fires before CM6 can stop propagation
  }

  adjust(dir) {
    const cm = this.app.workspace.activeLeaf?.view?.editor?.cm;
    if (!cm) return;

    const coords = cm.coordsAtPos(cm.state.selection.main.head);
    if (!coords) return;

    const rect = cm.scrollDOM.getBoundingClientRect();
    const margin = cm.defaultLineHeight * ROWS;

    if (dir === 'down') {
      const gap = rect.bottom - coords.bottom;
      if (gap < margin) cm.scrollDOM.scrollTop += margin - gap;
    } else {
      const gap = coords.top - rect.top;
      if (gap < margin) cm.scrollDOM.scrollTop -= margin - gap;
    }
  }
}

module.exports = CursorScrollOffPlugin;
