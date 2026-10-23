# Активный контекст

## Текущая задача
Сайт и PWA-приложение бара **«Бульвар 21»** по правилам `.roorules`. Навигация из двух экранов: **Landing** (визитка со слайдшоу и кнопками) → **Меню** (категории, карточки, заказ). Контент перенесён из реальных проектов пользователя (папки на диске M:).

## Экраны (состояние `view` в `App.jsx`)
- `landing` — стартовая визитка: слайдшоу 6 фото интерьера, логотип, статус/часы, кнопки: «Меню бара», «Забронировать», «Чаевые», «Яндекс.Карты», «Instagram», «Telegram». Нижней навигации нет.
- `menu` — шапка с «назад» и звонком, акции, табы категорий, список блюд, подвал, нижняя навигация. **Ознакомительное меню — без заказа и корзины.**

## Договорённости по проекту
- **Язык общения — русский.** Ответы и тексты интерфейса на русском.
- Бренд — реальный бар: **Бульвар 21** (Азов, Петровский бульвар 21).
- Стек по `.roorules`: React + Vite, Tailwind CSS, Lucide-React, PWA.
- Все данные меню — только в `src/data/menu.json`, без хардкода в верстке.
- Не удалять/не перезаписывать существующие функции без прямого запроса.

## Контакты и реквизиты (из меню бара)
- Адрес: Азов, Петровский бульвар, 21
- Телефон: +7 (938) 162-52-73
- Часы: Пн–Чт, Вс 13:00–00:00 · Пт–Сб 13:00–01:00
- Instagram: https://www.instagram.com/bulvar.21 · Telegram: https://t.me/bulvarr21
- Яндекс.Карты: https://yandex.ru/maps/org/bulvar_21/119025499425
- Чаевые: https://netmonet.co/qr/830163/tip?o=4

## Структура файлов
```
bar-app/
├─ .roorules                  # правила проекта (читать первым)
├─ index.html                 # точка входа + PWA-мета
├─ vite.config.js             # react + tailwind + vite-plugin-pwa (manifest, workbox)
├─ public/
│  ├─ brand/logo.png          # логотип «Бульвар 21» (скрипт, кремовый)
│  ├─ brand/icon-mark.png     # знак — два бокала (источник для иконок)
│  ├─ menu/                   # 23 фото блюд (ASCII-имена)
│  ├─ gallery/                # 11 фото интерьера
│  ├─ icons/                  # иконки соцсетей/действий
│  ├─ apple-touch-icon.png, pwa-192x192.png, pwa-512x512.png, pwa-maskable-512x512.png
│  └─ robots.txt
├─ scripts/generate-icons.mjs # PNG-декодер + ресайз знака → иконки PWA
├─ scripts/deploy.mjs         # сборка + публикация на GitHub Pages
├─ src/
│  ├─ main.jsx, App.jsx       # сборка страницы, переключение экранов, scroll-spy
│  ├─ index.css               # @font-face + Tailwind v4 @theme (палитра бренда)
│  ├─ assets/fonts/           # SoyuzGroteskBold, Denistina, Wremena
│  ├─ data/menu.json          # venue / promos / categories[].items[]
│  ├─ lib/format.js, asset.js # asset() → префикс base для файлов из public/
│  ├─ hooks/usePwaInstall.js
│  └─ components/             # Landing, Header, PromoBanner, CategoryTabs,
│                             # MenuSection, MenuItemCard, Lightbox, BottomNav, InstallPrompt
└─ memory-bank/progress.md, activeContext.md
```

## Палитра и типографика
- Акцент: `#9B0000` · кремовый `#FFF9CA` · синий `#0B2480` · фон `#121212`.
- Заголовки: `Soyuz Grotesk Bold`. Текст: `Wremena Light`. Скрипт: `Denistina`.

## Команды
- `npm run dev` — dev-сервер (PWA доступна в dev).
- `npm run build` — прод-сборка + `sw.js` и `manifest.webmanifest`.
- `npm run preview` — предпросмотр собранной PWA.
- `npm run icons` — перегенерировать PNG-иконки из `public/brand/icon-mark.png`.
- `npm run deploy` — собрать и опубликовать на GitHub Pages (ветка `gh-pages`).

## Сайт
- Живой адрес: https://bulvar2161.github.io/bar-app/
- Хостинг: GitHub Pages, ветка `gh-pages`, `base: '/bar-app/'`.

## Технические заметки
- Windows: `npm` вызывается как `npm.cmd` (PowerShell ExecutionPolicy блокирует `npm.ps1`).
- Инструменты не читают пути с кириллицей — исходники копируются в ASCII-путь.
- Context7 MCP не настроен; документация бралась веб-поиском.
- Tailwind v4: тема в CSS через `@theme`, файла `tailwind.config.js` нет.
- Изображения `menu/` и `gallery/` исключены из precache (`globIgnores`) и кэшируются в runtime.
- Установка PWA на телефон требует HTTPS в проде; локально работает `localhost`.

## Известные ограничения
- Меню ознакомительное: заказ, корзина и отправка на бэкенд отсутствуют (по запросу).
- У коктейлей и напитков нет фото — используются эмодзи-плейсхолдеры.
- Фото `пинк флойд.JPG` использовано и для коктейля, и для бургера.
- Позиции пива — цена «по ассортименту» (`price: 0`, кнопка заказа скрыта).
