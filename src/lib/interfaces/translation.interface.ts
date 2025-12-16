export interface TranslationMap {
  [language: string]: {
    [key: string]: string | any;
  };
}

export interface TranslationConfig {
  defaultLanguage?: string;
  fallbackLanguage?: string;
  storageKey?: string;
}

export interface TranslateParams {
  [key: string]: string | number;
}