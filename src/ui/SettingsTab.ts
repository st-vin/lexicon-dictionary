import { App, PluginSettingTab, Setting } from 'obsidian';
import { WordNetSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';
import WordNetPlugin from '../main';

export class WordNetSettingTab extends PluginSettingTab {
  plugin: WordNetPlugin;

  constructor(app: App, plugin: WordNetPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    // Ribbon icon toggle
    new Setting(containerEl)
      .setName('Show ribbon icon')
      .setDesc('Display a ribbon icon to open the WordNet lookup')
      .addToggle(cb => {
        cb.setValue(this.plugin.settings.enableRibbon === true);
        cb.onChange(async value => {
          this.plugin.settings.enableRibbon = value;
          await this.plugin.saveSettings();
          
          if (value) {
            if (!this.plugin.ribbonIcon) {
              this.plugin.configureRibbonCommand();
            }
          } else {
            if (this.plugin.ribbonIcon) {
              this.plugin.ribbonIcon.remove();
              this.plugin.ribbonIcon = null;
            }
          }
        });
      });

    // Template for definition insertion
    let templateTextArea: any;
    new Setting(containerEl)
      .setName('Template for inserting a definition')
      .setDesc(
        'The template used for inserting a WordNet definition. ' +
        'Use {term} for the term looked up and {definition} for the definition of that term.'
      )
      .addExtraButton(b => {
        b.setIcon('reset')
          .setTooltip('Reset to default')
          .onClick(async () => {
            this.plugin.settings.insertTemplate = DEFAULT_SETTINGS.insertTemplate;
            await this.plugin.saveSettings();
            templateTextArea.setValue(this.plugin.settings.insertTemplate);
          });
      })
      .addTextArea(cb => {
        templateTextArea = cb;
        cb.setValue(this.plugin.settings.insertTemplate);
        cb.onChange(async value => {
          const newValue = value.trim().length === 0 
            ? DEFAULT_SETTINGS.insertTemplate 
            : value;
          this.plugin.settings.insertTemplate = newValue;
          await this.plugin.saveSettings();
        });
        cb.inputEl.rows = 2;
        cb.inputEl.cols = 40;
      });

    // Vocabulary settings
    new Setting(containerEl)
      .setName('Vocabulary folder path')
      .setDesc('Folder where the vocabulary file will be stored')
      .addText(cb => {
        cb.setValue(this.plugin.settings.vocabFolderPath);
        cb.onChange(async value => {
          const newValue = value.trim().length === 0 
            ? DEFAULT_SETTINGS.vocabFolderPath 
            : value.trim();
          this.plugin.settings.vocabFolderPath = newValue;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Vocabulary file name')
      .setDesc('Markdown file to store saved words')
      .addText(cb => {
        cb.setValue(this.plugin.settings.vocabFileName);
        cb.onChange(async value => {
          const newValue = value.trim().length === 0 
            ? DEFAULT_SETTINGS.vocabFileName 
            : value.trim();
          this.plugin.settings.vocabFileName = newValue;
          await this.plugin.saveSettings();
        });
      });

    // Flashcard settings
    new Setting(containerEl)
      .setName('Enable flashcard popups')
      .setDesc('Show periodic flashcards with saved vocabulary')
      .addToggle(cb => {
        cb.setValue(this.plugin.settings.flashcardAutoPopupsEnabled);
        cb.onChange(async value => {
          this.plugin.settings.flashcardAutoPopupsEnabled = value;
          await this.plugin.saveSettings();
          this.plugin.configureFlashcardInterval();
        });
      });

    new Setting(containerEl)
      .setName('Flashcard interval (minutes)')
      .setDesc('How often to show a flashcard when enabled')
      .addSlider(cb => {
        cb.setLimits(5, 240, 5)
          .setValue(this.plugin.settings.flashcardIntervalMinutes)
          .setDynamicTooltip();
        cb.onChange(async value => {
          this.plugin.settings.flashcardIntervalMinutes = value;
          await this.plugin.saveSettings();
          this.plugin.configureFlashcardInterval();
        });
      });
  }
}