import { Plugin, MarkdownView } from 'obsidian';

export function registerCommands(plugin: Plugin) {
  plugin.addCommand({
    id: 'open-wordnet-suggestor',
    name: 'Look up a word',
    callback: () => {
      (plugin as any).openDictionarySuggester();
    },
  });

  plugin.addCommand({
    id: 'add-selection-to-vocabulary',
    name: 'Add selection to vocabulary',
    checkCallback: (checking: boolean) => {
      const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view) return false;

      const hasSelection = view.getMode() !== undefined && view.editor.somethingSelected();
      if (checking) return hasSelection;

      const selection = view.editor.getSelection();
      const [term, ...rest] = selection.split(' - ');
      const definition = rest.join(' - ') || selection;
      (plugin as any).addToVocabulary(term.trim(), definition.trim());
      return true;
    },
  });

  plugin.addCommand({
    id: 'open-vocabulary-flashcard',
    name: 'Open vocabulary flashcard',
    callback: () => {
      (plugin as any).openFlashcard();
    },
  });
}

export function registerContextMenu(plugin: Plugin) {
  plugin.registerEvent(
    plugin.app.workspace.on('editor-menu', (menu, editor, view) => {
      if (!view) return;

      const selection = editor.somethingSelected() ? editor.getSelection() : null;

      const getWordUnderCursor = () => {
        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line) || '';
        const left = line.slice(0, cursor.ch);
        const right = line.slice(cursor.ch);
        const leftWord = (left.match(/[A-Za-z'\-]+$/) || [''])[0];
        const rightWord = (right.match(/^[A-Za-z'\-]+/) || [''])[0];
        return (leftWord + rightWord).trim();
      };

      menu.addItem((i) => {
        i.setTitle('Look up selection')
          .setIcon('search')
          .onClick(() => {
            const term = selection && selection.trim().length > 0 ? selection.trim() : getWordUnderCursor();
            if (!term || term.length === 0) {
              (plugin as any).openDictionarySuggester();
              return;
            }
            (plugin as any).openDictionarySuggesterWithTerm(term);
          });
      });

      menu.addItem((i) => {
        i.setTitle('Add selection to vocabulary')
          .setIcon('plus')
          .onClick(() => {
            const text = selection && selection.trim().length > 0 ? selection.trim() : getWordUnderCursor();
            if (!text || text.length === 0) return;

            const parts = text.split(' - ');
            const term = parts[0];
            const definition = parts.slice(1).join(' - ') || term;
            (plugin as any).addToVocabulary(term.trim(), definition.trim());
          });
      });
    })
  );
}

