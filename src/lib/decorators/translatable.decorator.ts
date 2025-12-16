import { TranslatorService } from '../services/translator.service';
import { TranslationMap } from '../interfaces/translation.interface';

/**
 * Decorator to automatically load component translations
 * Usage: @Translatable('component-id', translations)
 */
export function Translatable(componentId: string, translations: TranslationMap) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        
        // Helper to get injected service
        const getInjectedService = (serviceName: string): any => {
          return (this as any)[serviceName.charAt(0).toLowerCase() + serviceName.slice(1)];
        };
        
        // Get TranslatorService instance
        const translatorService = (args[0] as any)?.translatorService || 
                                 getInjectedService('TranslatorService');
        
        if (translatorService) {
          translatorService.loadTranslations(componentId, translations);
        }
      }
    };
  };
}
