# RoomieMatch Frontend

RoomieMatch — веб-сервис для поиска соседа по общежитию или совместной аренде жилья среди студентов.

## Технологии

- React
- TypeScript
- Vite
- ESLint
- Prettier
- Husky (pre-commit hooks)

## Запуск проекта

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запустить dev-сервер:

```bash
npm run dev
```

### 3. Сборка для продакшена:

```bash
npm run build
```

Превью сборки:

```bash
npm run preview
```

Линтинг и форматирование
ESLint и Prettier настроены. Чтобы проверить код:

```bash
npx eslint .
npx prettier --check .
```

Автоисправление:

```bash
npx eslint . --fix
npx prettier --write .
```

Git Hooks
Husky + lint-staged настроены для pre-commit проверки.
Все staged файлы автоматически проверяются ESLint и Prettier перед коммитом.


### 4. API-слой и OpenAPI:

В проекте настроена генерация API-слоя на основе OpenAPI-спецификации с помощью @hey-api/openapi-ts.

Что используется
- конфиг генерации: openapi-ts.config.ts
- команда генерации: npm run openapi:generate
- сгенерированные файлы: src/shared/api/generated

Как сгенерировать API-слой
- Получить актуальную OpenAPI-спецификацию
- Положить её в корень проекта как openapi.yaml

Запустить команду:
```
npm run openapi:generate
```

После этого будут сгенерированы типы и методы API в папке:
```
src/shared/api/generated
```