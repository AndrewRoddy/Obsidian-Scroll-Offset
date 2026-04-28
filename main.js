'use strict';

var obsidian = require('obsidian');

var DEFAULT_SETTINGS = { rows: 8 };

class CursorScrollOffPlugin extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new CursorScrollOffSettingTab(this.app, this));

    this.registerDomEvent(document, 'keydown', (e) => {
      var noMod = !e.ctrlKey && !e.altKey && !e.metaKey;
      if (e.key === 'ArrowDown' || (noMod && e.key === 'j')) {
        queueMicrotask(() => requestAnimationFrame(() => this.adjust('down')));
      } else if (e.key === 'ArrowUp' || (noMod && e.key === 'k')) {
        queueMicrotask(() => requestAnimationFrame(() => this.adjust('up')));
      }
    }, true);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  adjust(dir) {
    var cm = this.app.workspace.activeLeaf?.view?.editor?.cm;
    if (!cm) return;

    var coords = cm.coordsAtPos(cm.state.selection.main.head);
    if (!coords) return;

    var rect = cm.scrollDOM.getBoundingClientRect();
    var margin = cm.defaultLineHeight * this.settings.rows;

    if (dir === 'down') {
      var gap = rect.bottom - coords.bottom;
      if (gap < margin) cm.scrollDOM.scrollTop += margin - gap;
    } else {
      var gap = coords.top - rect.top;
      if (gap < margin) cm.scrollDOM.scrollTop -= margin - gap;
    }
  }
}

class CursorScrollOffSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    var { containerEl } = this;
    containerEl.empty();

    var info = containerEl.createEl('div', { cls: 'setting-item setting-item-heading' })
                           .createEl('div', { cls: 'setting-item-info' });
    info.createEl('div', { text: 'Cursor Scroll Offset', cls: 'setting-item-name' });
    var desc = info.createEl('div', { cls: 'setting-item-description' });
    desc.appendText('Made by Andrew Roddy. Found a bug or have an idea? Open a pull request on the ');
    desc.appendChild(createEl('a', { text: 'GitHub repository', href: 'https://github.com/AndrewRoddy/Obsidian-Cursor-Scrolloff' }));
    desc.appendText('.');

    new obsidian.Setting(containerEl)
      .setName('Scroll offset rows')
      .setDesc('Number of visual rows to keep between the cursor and the edge of the screen. Default: 8.')
      .addSlider((slider) => {
        slider
          .setLimits(1, 30, 1)
          .setValue(this.plugin.settings.rows)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.rows = value;
            await this.plugin.saveSettings();
          });
      });
  }
}

module.exports = CursorScrollOffPlugin;
