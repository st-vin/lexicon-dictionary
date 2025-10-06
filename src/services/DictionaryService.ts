import { App, Notice, request } from 'obsidian';
import { DictionaryItem } from '../types';
import { WORDNET_DICT_URL } from '../utils/constants';

export class DictionaryService {
  private wordNet: DictionaryItem[] | null = null;
  private customDict: DictionaryItem[] | null = null;
  private manifestDir: string;

  constructor(
    private app: App,
    manifestDir: string
  ) {
    this.manifestDir = manifestDir;
  }

  async initialize(): Promise<void> {
    const pathWordNetJson = `${this.manifestDir}/dict-WordNet.json`;
    const adapter = this.app.vault.adapter;

    if (await adapter.exists(pathWordNetJson)) {
      const fileWordNet = await adapter.read(pathWordNetJson);
      this.wordNet = JSON.parse(fileWordNet);
    } else {
      await this.downloadWordNet(pathWordNetJson);
    }

    // Load custom dictionary if exists
    const customDictPath = `${this.manifestDir}/dict-MyDict.json`;
    if (await adapter.exists(customDictPath)) {
      const fileCustomDict = await adapter.read(customDictPath);
      this.customDict = JSON.parse(fileCustomDict);
    }
  }

  private async downloadWordNet(pathWordNetJson: string): Promise<void> {
    const adapter = this.app.vault.adapter;
    
    if (!navigator.onLine) {
      new Notice(
        "You do not have an internet connection, and the WordNet dictionary cannot be downloaded. " +
        "Please restore your internet connection and restart Obsidian",
        30000
      );
      throw new Error("No internet connection");
    }

    const downloadMessage = new Notice(
      "WordNet dictionary is being downloaded, this may take a few minutes. " +
      "This message will disappear when the process is complete.",
      0
    );

    try {
      const response = await request({ url: WORDNET_DICT_URL });
      downloadMessage.hide();

      if (response === "Not Found" || response === `{"error":"Not Found"}`) {
        new Notice(
          "The WordNet dictionary file is not currently available for download. " +
          "Please try again later or contact the developer on Twitter: @TfThacker for support.",
          30000
        );
        throw new Error("Dictionary not found");
      }

      this.wordNet = JSON.parse(response);
      await adapter.write(pathWordNetJson, JSON.stringify(this.wordNet));
    } catch (e) {
      downloadMessage.hide();
      new Notice(`An error has occurred with the download, please try again later: ${e}`);
      throw e;
    }
  }

  query(term: string): DictionaryItem[] {
    const results: DictionaryItem[] = [];
    const searchTerm = term.toLowerCase();
    let countOfFoundMatches = 0;

    // Search custom dictionary first
    if (this.customDict) {
      for (let i = 0; i < this.customDict.length && countOfFoundMatches < 30; i++) {
        const item = this.customDict[i];
        if (item.SearchTerm.startsWith(searchTerm)) {
          results.push(this.customDict[i]);
          countOfFoundMatches++;
        }
      }
    }

    // Then search WordNet
    countOfFoundMatches = 0;
    if (this.wordNet) {
      for (let i = 0; i < this.wordNet.length && countOfFoundMatches < 20; i++) {
        const item = this.wordNet[i];
        if (item.SearchTerm.startsWith(searchTerm)) {
          results.push(this.wordNet[i]);
          countOfFoundMatches++;
        }
      }
    }

    return results;
  }

  isInitialized(): boolean {
    return this.wordNet !== null;
  }
}