# WorkDo landing

Исходники лендинга WorkDo. Сборка публикуется в корень репозитория — GitHub Pages отдаёт её по адресу https://glcskl.github.io/workdo-landing/.

## Разработка

```
npm install
npm run dev
```

## Сборка и публикация

```
npm run build
git add .
git commit -m "..."
git push origin main
```

`npm run build` собирает Vite-проект в `dist/`, затем `scripts/sync-build.mjs` копирует результат в корень репозитория (`index.html`, `assets/`, `fonts/`, `register/`, `docs/`, `.nojekyll`).

## Структура

- `src/App.jsx` — секции лендинга, интерактивное демо, реалистичный Mac-подобный мокап и модальное окно демо.
- `src/data.js` — тексты, статистика, тарифы, демо-данные.
- `src/styles.css` — стили, включая неизменное соотношение экрана ноутбука 16:10.
- `src/index.html` — шаблон страницы; `prebuild` копирует его в корневой `index.html`.
- `public/register/index.html` — отдельная страница регистрации/входа в новом дизайне.
- `public/docs/index.html` — документы (политика, соглашение, оферта).
