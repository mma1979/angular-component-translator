# Angular Component Translator

A powerful, component-level translation package for Angular 16+ applications.

## Features

- ✅ Component-level translation files
- ✅ Auto-discovery of translations
- ✅ Nested key support (e.g., `user.profile.name`)
- ✅ Language persistence (localStorage)
- ✅ Reactive language changes (Observable)
- ✅ String interpolation support
- ✅ Fallback to key if translation missing
- ✅ TypeScript support

## Installation

```bash
npm install angular-component-translator
```

## Setup

### 1. Import Module

```typescript
// app.module.ts
import { TranslatorModule } from 'angular-component-translator';

@NgModule({
  imports: [
    TranslatorModule.forRoot({
      defaultLanguage: 'en',
      storageKey: 'app_language'
    })
  ]
})
export class AppModule { }
```

### 2. Create Translation File

Create `component.json` next to your component:

```json
{
  "en": {
    "title": "Hello World",
    "user": {
      "welcome": "Welcome {name}",
      "profile": {
        "title": "User Profile"
      }
    }
  },
  "ar": {
    "title": "مرحبا بالعالم",
    "user": {
      "welcome": "مرحبا {name}",
      "profile": {
        "title": "الملف الشخصي"
      }
    }
  },
  "de": {
    "title": "Hallo Welt",
    "user": {
      "welcome": "Willkommen {name}",
      "profile": {
        "title": "Benutzerprofil"
      }
    }
  }
}
```

### 3. Use in Component

```typescript
// my-component.component.ts
import { Component, OnInit } from '@angular/core';
import { TranslatorService } from 'angular-component-translator';
import translations from './my-component.json';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html'
})
export class MyComponentComponent implements OnInit {
  componentId = 'my-component';

  constructor(private translator: TranslatorService) {}

  ngOnInit() {
    // Load component translations
    this.translator.loadTranslations(this.componentId, translations);
  }

  changeLanguage(lang: string) {
    this.translator.setLanguage(lang);
  }
}
```

### 4. Use in Template

```html
<!-- my-component.component.html -->
<h1>{{ 'title' | T: componentId }}</h1>
<p>{{ 'user.welcome' | T: componentId: {name: 'John'} }}</p>
<p>{{ 'user.profile.title' | T: componentId }}</p>

<button (click)="changeLanguage('en')">English</button>
<button (click)="changeLanguage('ar')">العربية</button>
<button (click)="changeLanguage('de')">Deutsch</button>
```

## API Reference

### TranslatorService

```typescript
// Load translations
loadTranslations(componentId: string, translations: TranslationMap): void

// Change language
setLanguage(language: string): void

// Get current language
getCurrentLanguage(): string

// Translate key
translate(componentId: string, key: string, params?: object): string

// Observable for language changes
language$: Observable<string>

// Get available languages
getAvailableLanguages(componentId: string): string[]
```

### T Pipe

```html
<!-- Basic usage -->
{{ 'key' | T: 'component-id' }}

<!-- With nested keys -->
{{ 'user.profile.name' | T: 'component-id' }}

<!-- With interpolation -->
{{ 'greeting' | T: 'component-id': {name: 'John', age: 30} }}
```

## Advanced Usage

### Subscribe to Language Changes

```typescript
this.translator.language$.subscribe(lang => {
  console.log('Language changed to:', lang);
});
```

### Programmatic Translation

```typescript
const translated = this.translator.translate('my-component', 'user.welcome', {
  name: 'Alice'
});
```

## License

MIT