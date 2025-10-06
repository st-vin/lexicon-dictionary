import { Modal, App } from 'obsidian';

export class FlashcardModal extends Modal {
  private term: string;
  private definition: string;
  private onAgainCallback?: () => void;

  constructor(
    app: App, 
    term: string, 
    definition: string,
    onAgainCallback?: () => void
  ) {
    super(app);
    this.term = term;
    this.definition = definition;
    this.onAgainCallback = onAgainCallback;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    
    const wrapper = contentEl.createDiv({ cls: 'wn-flashcard' });
    
    wrapper.createEl('div', { 
      cls: 'wn-flashcard-term', 
      text: this.term 
    });
    
    const def = wrapper.createEl('div', { 
      cls: 'wn-flashcard-definition is-hidden', 
      text: this.definition 
    });
    
    const controls = wrapper.createDiv({ cls: 'wn-flashcard-controls' });
    
    const revealBtn = controls.createEl('button', { text: 'Reveal' });
    const againBtn = controls.createEl('button', { text: 'Again' });
    const goodBtn = controls.createEl('button', { text: 'Good' });
    
    revealBtn.addEventListener('click', () => {
      def.toggleClass('is-hidden');
    });
    
    againBtn.addEventListener('click', () => {
      this.close();
      if (this.onAgainCallback) {
        setTimeout(() => this.onAgainCallback!(), 5000);
      }
    });
    
    goodBtn.addEventListener('click', () => this.close());
  }

  onClose(): void {
    this.contentEl.empty();
  }
}