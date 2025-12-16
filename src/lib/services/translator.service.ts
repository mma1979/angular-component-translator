import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslationMap, TranslationConfig, TranslateParams } from '../interfaces/translation.interface';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  private translations: Map<string, TranslationMap> = new Map();
  private currentLanguageSubject: BehaviorSubject<string>;
  private defaultLanguage = 'en';
  private storageKey = 'app_language';

  public language$: Observable<string>;

  constructor() {
    const savedLang = this.getStoredLanguage() || this.defaultLanguage;
    this.currentLanguageSubject = new BehaviorSubject<string>(savedLang);
    this.language$ = this.currentLanguageSubject.asObservable();
  }

  /**
   * Configure translator settings
   */
  configure(config: TranslationConfig): void {
    if (config.defaultLanguage) {
      this.defaultLanguage = config.defaultLanguage;
    }
    if (config.storageKey) {
      this.storageKey = config.storageKey;
    }
  }

  /**
   * Load translations for a component
   */
  loadTranslations(componentId: string, translations: TranslationMap): void {
    this.translations.set(componentId, translations);
  }

  /**
   * Set current language
   */
  setLanguage(language: string): void {
    this.currentLanguageSubject.next(language);
    this.storeLanguage(language);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  /**
   * Translate a key for a specific component
   */
  translate(componentId: string, key: string, params?: TranslateParams): string {
    const componentTranslations = this.translations.get(componentId);
    
    if (!componentTranslations) {
      console.warn(`No translations found for component: ${componentId}`);
      return key;
    }

    const currentLang = this.getCurrentLanguage();
    const langTranslations = componentTranslations[currentLang];

    if (!langTranslations) {
      console.warn(`No translations found for language: ${currentLang} in component: ${componentId}`);
      return key;
    }

    // Support nested keys (e.g., "user.profile.name")
    const value = this.getNestedValue(langTranslations, key);

    if (value === undefined || value === null) {
      console.warn(`Translation key not found: ${key} for language: ${currentLang}`);
      return key; // Fallback to key itself
    }

    // Handle interpolation
    if (params && typeof value === 'string') {
      return this.interpolate(value, params);
    }

    return value;
  }

  /**
   * Get available languages for a component
   */
  getAvailableLanguages(componentId: string): string[] {
    const componentTranslations = this.translations.get(componentId);
    return componentTranslations ? Object.keys(componentTranslations) : [];
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Interpolate parameters into translation string
   * Example: "Hello {name}" with {name: "John"} => "Hello John"
   */
  private interpolate(text: string, params: TranslateParams): string {
    return text.replace(/{(\w+)}/g, (match, key) => {
      return params.hasOwnProperty(key) ? String(params[key]) : match;
    });
  }

  /**
   * Store language in localStorage
   */
  private storeLanguage(language: string): void {
    try {
      localStorage.setItem(this.storageKey, language);
    } catch (e) {
      console.error('Failed to store language preference', e);
    }
  }

  /**
   * Get stored language from localStorage
   */
  private getStoredLanguage(): string | null {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (e) {
      console.error('Failed to retrieve language preference', e);
      return null;
    }
  }

  /**
   * Clear a component's translations (useful for cleanup)
   */
  clearComponentTranslations(componentId: string): void {
    this.translations.delete(componentId);
  }

  /**
   * Clear all translations
   */
  clearAllTranslations(): void {
    this.translations.clear();
  }
}