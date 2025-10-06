// Type definitions for the WordNet plugin

export interface WordNetSettings {
    enableRibbon: boolean;
    insertTemplate: string;
    vocabFolderPath: string;
    vocabFileName: string;
    flashcardAutoPopupsEnabled: boolean;
    flashcardIntervalMinutes: number;
  }
  
  export interface DictionaryItem {
    SearchTerm: string;
    Term: string;
    Definition: string;
    item?: {
      Term: string;
      Definition: string;
    };
  }
  
  export interface VocabularyEntry {
    term: string;
    definition: string;
  }