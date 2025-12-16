import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatorService } from './services/translator.service';
import { TranslatePipe } from './pipes/translate.pipe';
import { TranslationConfig } from './interfaces/translation.interface';

@NgModule({
  declarations: [TranslatePipe],
  imports: [CommonModule],
  exports: [TranslatePipe]
})
export class TranslatorModule {
  static forRoot(config?: TranslationConfig): ModuleWithProviders<TranslatorModule> {
    return {
      ngModule: TranslatorModule,
      providers: [
        TranslatorService,
        {
          provide: 'TRANSLATOR_CONFIG',
          useValue: config || {}
        }
      ]
    };
  }
}
