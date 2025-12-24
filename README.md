# Observations Service  
_React SPA клієнт для управління астрономічними спостереженнями та авторами._

## Опис проєкту
Клієнтська частина реалізує UI для роботи з астрономічними спостереженнями та авторами: перегляд списку спостережень, фільтрація та пагінація, створення, редагування та видалення сутностей, сторінка спостереження з режимами View / Edit, інтеграція з REST API.  

___

## Технологічний стек
- React 18  
- React Router DOM  
- JavaScript (ES6+)  
- Fetch API  
- CSS  
- Node.js

___

## Архітектура  
Клієнт побудований як Single Page Application з маршрутизацією:  
- /observations - список спостережень  
- /observations/new - створення нового спостереження  
- /observations/:id — детальна сторінка спостереження
  
_Стан фільтрів та пагінації зберігається в URL, тому можна перезавантажувати сторінку без втрати стану та повертатися назад зі збереженими параметрами._
___

## Запуск сервера
### Клонування репозиторію (завантаження https://github.com/OlesiaShevchenko245/Internship_Task2)
```
git clone <repository-url>
cd Internship_Task2
```
### Налаштування PostgreSQL (локально)
```
psql -U postgres 
CREATE DATABASE cosmorum_db;
# за необхідності:
CREATE USER postgres WITH PASSWORD 'pass';
GRANT ALL PRIVILEGES ON DATABASE cosmorum_db TO postgres;
```
### Запуск
```
# компіляція
./mvnw compile

# з використанням Maven Wrapper 
./mvnw spring-boot:run

# якщо Maven встановлений глобально
mvn spring-boot:run
```
Додаток має запуститися на http://localhost:8080  

### Перевірка роботи
```
# отримати список авторів
curl http://localhost:8080/api/author
```
_Очікуваний результат - JSON з 5 авторами: Galileo Galilei, Edwin Hubble, Johannes Kepler, Caroline Herschel, Tycho Brahe._  

## Запуск клієнта  
### Клонування репозиторію (завантаження https://github.com/OlesiaShevchenko245/Internship_Task3)
```
git clone <repository-url>
cd Internship_Task3
```
### Встановлення залежностей 
```
npm install
```
### Запуск у режимі розробки  
```
npm start
```
Клієнт має запуститися на http://localhost:3000  
___

### Структура проєкту:
```
Internship_Task3/
├── src/
│   ├── pages/
│   │   ├── ObservationsListPage.jsx
│   │   └── ObservationDetailsPage.jsx
│   │   ├── ObservationsListPage.css
│   │   └── ObservationDetailsPage.css
│   ├── services/
│   │   ├── observationApi.js
│   │   └── authorApi.js
│   ├── App.jsx
│   └── index.js
├── public/
├── package.json
└── README.md
```
___

### Функціональність  

1. Список спостережень  
- відображає основні поля:  
  - назва  
  - дата спостереження  
  - автор  
- кнопка Delete зʼявляється при наведенні  
  - підтвердження видалення у модальному вікні  
  - toast-повідомлення про успіх / помилку  
2. Фільтрація
- фільтр по автору (select)  
- пошук по назві  
- фільтр по даті  
3. Пагінація  
- серверна пагінація  
- номер сторінки та розмір сторінки зберігаються в URL  
- стан не скидається при refresh  
4. Сторінка спостереження  

Підтримує два режими:  
- View mode  
  - відображення всіх полів  
  - кнопка Edit  
- Edit / Create mode  
  - редагування всіх полів  
  - client-side валідація  
  - кнопки Save / Cancel    
  - toast-повідомлення після успішного збереження  
  - при Cancel відбувається повернення до попереднього стану  
5. Створення спостереження  
- окремий маршрут /observations/new  
- форма одразу відкривається в режимі редагування  
- вибір автора зі списку (дані з /api/author)  
- після створення відбувається повернення до списку  

___

### Інтеграція з API:  
Використані endpoints:  
- GET /api/author  
- POST /api/observation/_list  
- GET /api/observation/{id}  
- POST /api/observation  
- PUT /api/observation/{id}  
- DELETE /api/observation/{id}  

_Всі запити реалізовані через Fetch API у окремій папці services/._
___

## UI / UX  
- за тематикою проєкту обрано темну тему з жовто-білими акцентами
- мінімалістичний дизайн
- акцент на читабельність та зручність навігації
___

## Валідація

Для валідації реалізовано:  
- перевірку обовʼязкових полів на UI  
- підсвічення помилок
- відмова відправки запиту на сервер, якщо форма невалідна
___

## Автор

Проєкт виконала Олеся Шевченко в рамках **Full-Stack Internship** :)
