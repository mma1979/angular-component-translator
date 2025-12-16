import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslatorService } from '../services/translator.service';
import { TranslateParams } from '../interfaces/translation.interface';

@Pipe({
  name: 'T',
  pure: false // Impure pipe to detect language changes
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private componentId: string = '';
  private lastKey: string = '';
  private lastValue: string = '';
  private subscription?: Subscription;

  constructor(
    private translatorService: TranslatorService,
    private cdr: ChangeDetectorRef
  ) {
    // Subscribe to language changes
    this.subscription = this.translatorService.language$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: string, componentId?: string, params?: TranslateParams): string {
    if (!key) return '';

    // Use provided componentId or try to infer it
    const id = componentId || this.componentId;

    if (!id) {
      console.warn('No component ID provided for translation pipe');
      return key;
    }

    // Cache optimization
    if (key === this.lastKey && id === this.componentId) {
      return this.lastValue;
    }

    this.componentId = id;
    this.lastKey = key;
    this.lastValue = this.translatorService.translate(id, key, params);

    return this.lastValue;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
