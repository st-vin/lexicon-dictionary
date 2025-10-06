import { WordNetSettings } from '../types';

export const DEFAULT_SETTINGS: WordNetSettings = {
  enableRibbon: true,
  insertTemplate: "**{term}**\n{definition}\n",
  vocabFolderPath: "Vocabulary",
  vocabFileName: "lexicon.md",
  flashcardAutoPopupsEnabled: false,
  flashcardIntervalMinutes: 60
};

export const WORDNET_DICT_URL = 
  "https://github.com/TfTHacker/Obsidian-WordNet/releases/download/WordNetJson/dict-WordNet.json";