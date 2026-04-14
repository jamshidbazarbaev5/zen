# i18n Implementation Guide

## Overview
This application now supports 4 languages:
- English (en)
- Russian (ru)
- Uzbek (uz)
- Karakalpak (kk)

## Implementation Details

### Libraries Used
- `i18next` - Core internationalization framework
- `react-i18next` - React bindings for i18next

### File Structure
```
src/
├── i18n/
│   ├── config.ts          # i18n configuration
│   └── locales/
│       ├── en.json        # English translations
│       ├── ru.json        # Russian translations
│       ├── uz.json        # Uzbek translations
│       └── kk.json        # Karakalpak translations
├── context/
│   └── UserContext.tsx    # User context with language management
```

### Key Features

1. **User Language Preference**
   - Language is fetched from the API endpoint `/customers/me/`
   - User's language preference is stored in the `lang` field
   - Language is automatically synced between the app and the API

2. **Language Switching**
   - Users can change language via the Language Modal
   - When language is changed, it sends a PATCH request to `/customers/me/` with `{"lang": "xx"}`
   - The i18n context is updated automatically

3. **Context Integration**
   - `UserContext` manages user profile and language state
   - Automatically syncs i18n language with user's preference on load
   - Provides `updateLanguage()` function to update both API and local state

### Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('submit')}</button>
    </div>
  );
};
```

### Adding New Translations

1. Add the key-value pair to all 4 language files:
   - `src/i18n/locales/en.json`
   - `src/i18n/locales/ru.json`
   - `src/i18n/locales/uz.json`
   - `src/i18n/locales/kk.json`

2. Use the translation key in your component:
   ```tsx
   {t('yourNewKey')}
   ```

### API Integration

The app communicates with the backend API for language preferences:

**GET /customers/me/**
```json
{
  "id": 1,
  "telegram_id": 123456,
  "name": "User Name",
  "phone": "+998901234567",
  "lang": "uz",
  "balance": "0.00",
  "total_spent": "0.00",
  "is_active": true
}
```

**PATCH /customers/me/**
```json
{
  "lang": "uz"
}
```

### Menu Translations

Menu items (categories and products) are fetched from the API with language parameter:
- `GET /menu/?lang=uz`
- `GET /menu/?lang=ru`
- `GET /menu/?lang=en`
- `GET /menu/?lang=kk`

The menu content is translated on the backend side.

### Default Language

- Default language is set to Uzbek (`uz`)
- If user's preferred language is not available, it falls back to Uzbek
- Menu API falls back to Russian if requested language has no data

## Testing

1. Change language in the Language Modal
2. Verify the API request is sent to `/customers/me/`
3. Check that all UI texts update to the selected language
4. Reload the page and verify language persists from user profile
