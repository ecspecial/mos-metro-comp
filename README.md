![Mos Metro Logo](./public/assets/images/mm-logo-red.svg)


# Центр Oбеспечения Мобильности Пассажиров

## Оглавление

1. [Введение](#введение)
    - [Основные компоненты](#основные-компоненты)
    - [Функциональные возможности](#функциональные-возможности)
2. [Требования к ПО](#требования-к-по)
    - [Аппаратные требования](#аппаратные-требования)
    - [Программные требования](#программные-требования)
3. [Архитектура системы](#архитектура-системы)
    - [Компоненты и их взаимодействие](#компоненты-и-их-взаимодействие)
4. [Поток данных в системе и алгоритмы расчета](#поток-данных-в-системе-и-алгоритмы-расчета)



### Логины администратора для доступа и создания сотрудников
формат: логин:пароль
1. admin_1:password
2. admin_2:password
3. admin_3:password

## Введение

Центр обеспечения мобильности пассажиров Московского метрополитена, доступный по ссылке [mosmetro.work](https://mosmetro.work/) предоставляет веб сервис для сопровождения маломобильных пассажиров, обеспечивая их комфортное и безопасное передвижение по метро и социальным объектам города Москвы. С 2014 года Центр оформил более 1.5 млн. заявок на сопровождение, что подчеркивает важность оптимизации процесса обработки и распределения заявок, - задачу, которую рещает наш сервис.

### Основные компоненты:

1. **Главный экран**:
    ![Main page site](./public/documentation/images/main-page.png)
    ![Main page site mobile](./public/documentation/images/main-page-mobile.png)
    ![Main page site mobile navigation](./public/documentation/images/main-page-mobile-navigation.png)
    - Отображает все доступные пользователю элементы меню (ранжировка исходя из должности).
    - Логотип сервиса.
    - Путь доступа `/`
    - [Ответственный за страницу файл](app/page.tsx)

2. **Экран всех заявок**:
    ![Applications page site](./public/documentation/images/applications-page.png)
    ![Applications page site mobile](./public/documentation/images/applications-page-mobile.png)
    - Отображает все текущие заявки.
    - Возможность внесения изменений администратором, специалистом и оператором.
    - Возможность создания новой заявки
    - Возможность перехода на страницу заявки
    - Путь доступа `/applications`
    - [Ответственная за страницу папка](app/applications/)

3. **Экран заявки**:
    ![Application page site](./public/documentation/images/application-page.png)
    ![Application page site mobile](./public/documentation/images/application-page-mobile.png)
    - Показывает информацию о заявке.
    - Полный доступ для редактирования у администратора, специалиста и оператора.
    - Ограниченный доступ у сотрудников сопровождения для просмотра назначенных заявок на сотрудника.
    - Путь доступа `/application/[ID заявки]`
    - [Ответственная за страницу папка](app/application/)

4. **Экран всех пассажиров**:
    ![Passanger page site](./public/documentation/images/passengers-page.png)
    ![Passanger page site mobile](./public/documentation/images/passengers-page-mobile.png)
    ![Passanger add page site](./public/documentation/images/new-passanger.png)
    ![Passanger add page site mobile](./public/documentation/images/new-passamger-mobile.png)
    - Отображает всех текущих пассажиров в системе.
    - Возможность внесения изменений администратором, специалистом и оператором.
    - Возможность добавления нового пассажира
    - Возможность перехода на страницу пассажира
    - Путь доступа `/passengers`
    - [Ответственная за страницу папка](app/passengers/)

5. **Экран пассажира**:
    ![Passanger page site](./public/documentation/images/passanger-page.png)
    ![Passanger page site mobile](./public/documentation/images/passanger-page-mobile.png)
    - Содержит информацию о пассажире с возможностью редактирования.
    - Доступен для администратора, специалиста и оператора.
    - Путь доступа `/passenger/[ID пассажира]`
    - [Ответственная за страницу папка](app/passenger/)

6. **Экран всех пользователей**:
    ![User page site](./public/documentation/images/users-page.png)
    ![User page site mobile](./public/documentation/images/users-page-mobile.png)
    ![User add page site](./public/documentation/images/new-user.png)
    ![User add page site mobile](./public/documentation/images/new-user-mobile.png)
    - Отображает всех текущих пользователей (данные по которым пользователи заходят в систему) в системе.
    - Возможность внесения изменений администратором.
    - Возможность добавления нового пользователя
    - Возможность перехода на страницу пользователя
    - Путь доступа `/users`
    - [Ответственная за страницу папка](app/users/)

7. **Экран пользователя**:
    ![User page site](./public/documentation/images/user-page.png)
    ![User page site mobile](./public/documentation/images/user-page-mobile.png)
    - Содержит информацию о пользователе с возможностью редактирования.
    - Доступен для администратора.
    - Путь доступа `/user/[ID пользователя]`
    - [Ответственная за страницу папка](app/user/)

8. **Экран всех сотрудников**:
    ![Employee page site](./public/documentation/images/employees-page.png)
    ![Employee page site mobile](./public/documentation/images/employees-page-mobile.png)
    ![Employee add page site](./public/documentation/images/new-employee.png)
    ![Employee add page site mobile](./public/documentation/images/new-employee-mobile.png)
    - Отображает всех текущих сотрудников в системе.
    - Возможность внесения изменений администратором, специалистом и оператором.
    - Возможность добавления нового сотрудника, его рабочего времени и всех необходимых параметров
    - Возможность перехода на страницу сотрудника
    - Путь доступа `/employees`
    - [Ответственная за страницу папка](app/employees/)

9. **Экран сотрудника**:
    ![Employee page site](./public/documentation/images/employee-page.png)
    ![Employee page site mobile](./public/documentation/images/employee-page-mobile.png)
    - Содержит информацию о пользователе с возможностью редактирования.
    - Доступен для администратора, специалиста и оператора.
    - Путь доступа `/user/[ID сотрудника]`
    - [Ответственная за страницу папка](app/employee/)

10. **Экран расписания**:
    ![Schedule page site](./public/documentation/images/schedule-page.png)
    ![Schedule page site mobile](./public/documentation/images/schedule-page-mobile.png)
    - Содержит информацию о расписании сотрудников на завтрашний день с возможностью выбора индивидуального сотрудника для отображения его актуальных заявок на временном графике.
    - Доступен для администратора, специалиста и оператора, также сотрудника в индивидуальном порядке с заявками, относящимися к данному сотруднику.
    - Путь доступа `/schedule`
    - [Ответственная за страницу папка](app/schedule/)

### Функциональные возможности:

- **Прием заявок** оператором и внесение в базу данных.
- **Автоматическое распределение заявок** между сотрудниками на заданный день (на данный момент система настроена на распределение заявок только на завтрашний день, при необходимости возможно выставить распределние на желаемый период).
- **Отслеживание выполнения заявок** в режиме реального времени.
- **Адаптивное подстраивание расписания** под изменяющиеся условия и переназначение сотрудников, изменения станций метрополитена, времени заявки.
- **Мониторинг заявок** возможность отображения всех заявок.
- **Регистрация сотрудников** и ведение учета их рабочего времени.
- **Безопасность данных** через использование протокола HTTPS и токенов доступа.

Данный веб-сервис значительно повышает эффективность работы сотрудников, обеспечивает оперативное реагирование на изменения в потоке заявок и улучшает качество обслуживания пассажиров.


## Требования к ПО:

Для успешного развертывания и использования веб-сервиса "Центр Обеспечения Мобильности Пассажиров" необходимо следующее аппаратное и программное обеспечение:

### Аппаратные требования:

1. **Сервер:**
    - Процессор: Минимум 4 ядра, рекомендовано 8 ядер.
    - Оперативная память: рекомендовано 16 GB, 32 GB.
    - Жесткий диск: рекомендовано SSD.
    - Сеть: рекомендовано высокоскоростное интернет-соединение с пропускной способностью не менее 100 Mbps.

2. **Клиентские устройства:**
    - Современные компьютеры или ноутбуки с оперативной памятью не менее 4 GB.
    - Мобильные устройства: смартфоны или планшеты с оперативной памятью не менее 2 GB и поддержкой современных браузеров.

### Программные требования:

1. **Операционная система:**
    - Для сервера: 
        - Ubuntu 20.04 LTS или выше.
        - Windows Server 2019 или выше.
        - CentOS 7 или выше.
    - Для клиента:
        - Windows 10 или выше.
        - macOS Catalina или выше.
        - Современные дистрибутивы Linux (например, Ubuntu, Fedora).

2. **База данных:**
    - PostgreSQL 13 или выше.

3. **Веб-сервер:**
    - Nginx 1.18 или выше.

4. **Язык программирования и среда выполнения:**
    - Node.js 18 или выше.

5. **Фреймворки и библиотеки:**
    - Next.js 14 и выше (с настройкой для работы с TypeScript).
    - React 18.
    - Prisma 5.15.0.

6. **Пакеты и зависимости:**
    - @chakra-ui/next-js 2.2.0.
    - @chakra-ui/react 2.8.2.
    - @emotion/react 11.11.4.
    - @emotion/styled 11.11.5.
    - @next-auth/prisma-adapter 1.0.7.
    - bcryptjs 2.4.3.
    - date-fns 3.6.0.
    - framer-motion 11.2.10.
    - next-auth 4.24.7.
    - react-datepicker 7.0.0.
    - react-select 5.8.0.
    - sass 1.77.6.
    - vis-timeline 7.7.3.

7. **Инструменты разработки:**
    - TypeScript 5.
    - ESLint 8.
    - Tailwind CSS 3.4.1.
    - PostCSS 8.

8. **Прочее ПО:**
    - Git для контроля версий.
    - PM2 для менеджмента процессов на сервере.

### Настройка окружения

Для настройки и развертывания приложения следуйте следующим шагам:

1. **Загрузка репозитория с кодом на локальное устройство:**
    ```sh
    git clone https://github.com/ecspecial/mos-metro-comp.git
    ```

2. **Установка необходимых пакетов:**
    ```sh
    npm install
    ```

3. **Настройка переменных окружения:**
    Откройте файл `.env` в корне проекта и добавьте необходимые переменные окружения:
    ```env
    POSTGRES_DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
    ```

    Откройте файл `.env.local` в корне проекта и добавьте необходимые переменные окружения, исходя из режима разработки (Production или Development также уберите комментарии ниже соответствующего блока PROD или DEV)

4. **Настройка Prisma для взаимодействия с базой данных:**
    Откройте консоль в корне проекта и после установки npm модулей выполните команды для настройки Prisma:

    Для создания таблиц в вашей базе данных используйте следующую команду:
    ```sh
    npx prisma db push
    ```

    Дальше для синхронизации схемы в проекте, выполните следующую команду:
     ```sh
    npx prisma generate
    ```

5. **Запуск приложения в режиме разработки:**
    ```sh
    npm run dev
    ```

6. **Сборка и запуск в режиме продакшн:**
    ```sh
    npm run build
    npm start
    ```

Следуя этим требованиям и инструкциям, вы сможете успешно развернуть и использовать веб-сервис "Центр Обеспечения Мобильности Пассажиров".


## Архитектура системы

Наш веб-сервис построен с использованием современных технологий и компонентов для обеспечения надежности, безопасности и производительности. В основе архитектуры лежат следующие компоненты и технологии:

- **Next.js**: Фреймворк для построения серверного и клиентского рендеринга React приложений.
- **TypeScript**: Язык программирования, который добавляет типизацию к JavaScript.
- **Prisma**: ORM для работы с базой данных, использующий PostgreSQL.
- **NextAuth**: Библиотека для аутентификации и авторизации пользователей.

### Компоненты и их взаимодействие

1. **Аутентификация и авторизация**

Аутентификация и авторизация в нашем приложении осуществляется с помощью NextAuth, который интегрируется с Prisma для управления пользователями и их ролями. 

**Ключевые файлы:**

- **Файл конфигурации NextAuth**:
  - **Путь**: `lib/auth.ts`
  - **Описание**: Определяет параметры и провайдеры аутентификации, такие как `CredentialsProvider`, а также настройки для генерации JWT токенов и управления сессиями.

- **Обработчик NextAuth**:
  - **Путь**: `/app/api/auth/[...nextauth]/route.ts`
  - **Описание**: Управляет запросами на аутентификацию, используя конфигурацию из `app/lib/auth.ts`.

### Инструкции по использованию

#### Описание доступных API методов и их параметров

##### Аутентификация

После успешного ввода верных логина и пароля `CredentialsProvider` возвращает сессию юхера доступную в компонентах

### Получение всех заявок

#### Компонент: ApplicationsPage

[Ответственная за страницу папка](app/applications/)
Этот компонент отвечает за отображение всех заявок в системе. Он позволяет пользователям с соответствующими ролями просматривать, фильтровать и управлять заявками. В зависимости от роли пользователя, заявки могут быть отфильтрованы для отображения только тех, которые назначены на него.

**Пример запроса API для получения всех заявок:**

GET: `/api/application/get/getAllApplications`
Authorization: `Bearer <your_access_token>`

**Пример ответа API:**

```json
{
  "applications": [
    {
      "id": 1,
      "datetime": "2024-06-21T12:00:00Z",
      "station1": {
        "name": "Стартовая станция"
      },
      "station2": {
        "name": "Конечная станция"
      },
      "category": "ИЗ",
      "assignments": [
        {
          "employeeId": 10,
          "employee": {
            "name": "Иван Иванов",
            "role": "оператор",
            "lunchBreak": "13:00-14:00"
          }
        }
      ]
    }
  ]
}
```

### Создание новой заявки

#### Компонент: NewApplicationModal

Этот компонент позволяет создать новую заявку через модальное окно. Он включает в себя формы для ввода данных о заявке, выбора пассажира, станций метро, а также дополнительных параметров как время поездки и категория пассажира.

**Пример запроса API для создания новой заявки:**

POST: `/api/application/post/createApplication`
Content-Type: `application/json`
Authorization: `Bearer <your_access_token>`

**Тело запроса:**

```json
{
  "passengerId": "1",
  "datetime": "2024-06-21T12:00:00Z",
  "startTime": "2024-06-21T12:00:00Z",
  "endTime": "2024-06-21T14:00:00Z",
  "category": "ИЗ",
  "status": "Принята",
  "maleStaffCount": 2,
  "femaleStaffCount": 1,
  "station1Id": 101,
  "station2Id": 102,
  "applicationType": "через электронные сервисы",
  "railway": "Казанский вокзал",
  "transferStations": ["Станция1", "Станция2"],
  "pathTime": 30,
  "pathString": "101-102",
  "description": "Дополнительная информация о заявке",
  "passengerQty": 1,
  "baggage": "Сумка, рюкзак"
}
```

**Пример ответа API создания новой заявки:**
```json
{
  "message": "Application created successfully",
  "application": {
    "id": 123,
    "passengerId": "1",
    "datetime": "2024-06-21T12:00:00Z",
    "startTime": "2024-06-21T12:00:00Z",
    "endTime": "2024-06-21T14:00:00Z",
    "category": "ИЗ",
    "status": "Принята",
    "maleStaffCount": 2,
    "femaleStaffCount": 1,
    "station1Id": 101,
    "station2Id": 102,
    "applicationType": "через электронные сервисы",
    "railway": "Казанский вокзал",
    "transferStations": ["Станция1", "Станция2"],
    "pathTime": 30,
    "pathString": "101-102",
    "description": "Дополнительная информация о заявке",
    "passengerQty": 1,
    "baggage": "Сумка, рюкзак"
  }
}
```

### Просмотр и управление конкретной заявкой

#### Компонент: ApplicationPage

Этот компонент отвечает за просмотр деталей конкретной заявки. Пользователи могут просматривать информацию о заявке, вносить изменения, переносить или отменять заявку в зависимости от своей роли.

**Пример запроса API для получения деталей заявки:**

POST: `/api/application/get/getApplication`
Content-Type: `application/json`
Authorization: `Bearer <your_access_token>`

**Тело запроса:**

```json
{
  "applicationId": "123"
}
```

**Пример ответа API деталей заявки:**

```json
{
  "id": 123,
  "datetime": "2024-06-21T12:00:00Z",
  "station1": {
    "name": "Стартовая станция"
  },
  "station2": {
    "name": "Конечная станция"
  },
  "category": "ИЗ",
  "status": "Принята",
  "passenger": {
    "fullName": "Иван Иванович",
    "category": "ИЗТ",
    "additionalInfo": "Требуется сопровождение"
  },
  "assignments": [
    {
      "employeeId": 10,
      "employee": {
        "name": "Иван Иванов",
        "role": "оператор",
        "lunchBreak": "13:00-14:00"
      }
    }
  ],
  "applicationType": "через электронные сервисы",
  "railway": "Казанский вокзал",
  "baggage": "Сумка, рюкзак",
  "description": "Дополнительная информация о заявке",
  "registrationTime": "2024-06-21T09:00:00Z"
}
```

Этот компонент предоставляет полную информацию о заявке, включая детали пассажира, станции отправления и прибытия, а также сотрудника, назначенного на заявку. Пользователи с соответствующими правами могут вносить изменения или отменять заявку прямо из этого интерфейса, обеспечивая быстрое и эффективное управление процессом.


### Управление пассажирами

#### Компонент: PassengersPage

Этот компонент отвечает за отображение списка всех пассажиров в системе. Администраторы и специалисты могут просматривать подробную информацию о каждом пассажире, добавлять новых пассажиров и редактировать информацию о существующих.

**Пример запроса API для получения списка пассажиров:**

GET: `/api/passenger/get/getAllPassengers`
Authorization: `Bearer <your_access_token>`

**Пример ответа API:**

```json
[
  {
    "id": 1,
    "fullName": "Иван Иванов",
    "gender": "мужской",
    "category": "ИЗТ",
    "eks": true,
    "createdAt": "2024-06-21T12:00:00Z",
    "phoneNumbers": [
      {
        "phone_number": "+79998887766",
        "description": "Основной"
      },
      {
        "phone_number": "+79998887767",
        "description": "Дополнительный"
      }
    ]
  },
  {
    "id": 2,
    "fullName": "Мария Сергеевна",
    "gender": "женский",
    "category": "ИЗ",
    "eks": false,
    "createdAt": "2024-06-20T12:00:00Z",
    "phoneNumbers": [
      {
        "phone_number": "+79991234567",
        "description": "Основной"
      }
    ]
  }
]
```

Этот компонент предоставляет информацию о каждом пассажире, включая ФИО, пол, категорию инвалидности, наличие электрокардиостимулятора, дату регистрации и контактные телефоны. Пользователи с соответствующими правами могут добавлять новых пассажиров или редактировать информацию о существующих через модальное окно, которое активируется нажатием на кнопку "Новый пассажир".

### Создание нового пассажира

#### Компонент: NewPassengerModal

Этот модальный компонент используется для добавления новых пассажиров в систему. Он предоставляет форму для ввода информации о пассажире, включая ФИО, пол, категорию инвалидности, дополнительную информацию, номера телефонов, а также наличие электрокардиостимулятора.

**Пример запроса API для создания нового пассажира:**

POST: `/api/passenger/post/createPassenger`
Content-Type: `application/json`
Authorization: `Bearer <your_access_token>`
Body:
```json
{
  "fullName": "Иван Петров",
  "phoneNumbers": [
    {
      "phone_number": "+79991234567",
      "description": "Основной"
    }
  ],
  "gender": "Мужской",
  "category": "ИЗТ",
  "additionalInfo": "Дополнительные сведения о здоровье",
  "eks": true
}
```

**Пример ответа API создания нового пассажира:**
```json
{
  "message": "Passenger created successfully",
  "passenger": {
    "id": 101,
    "fullName": "Иван Петров",
    "gender": "Мужской",
    "category": "ИЗТ",
    "eks": true,
    "createdAt": "2024-06-25T14:00:00Z",
    "phoneNumbers": [
      {
        "phone_number": "+79991234567",
        "description": "Основной"
      }
    ],
    "additionalInfo": "Дополнительные сведения о здоровье"
  }
}
```

Этот API позволяет создать запись пассажира с полной информацией, включая контактные данные, информацию о здоровье и другие персональные данные. После успешного создания пассажира, пользователь перенаправляется на страницу со списком всех пассажиров.


### Управление пользователями

#### Компонент: UsersPage

Этот компонент отвечает за отображение списка всех пользователей в системе. Пользователи могут просматривать, добавлять новых пользователей или управлять существующими записями. Только пользователи с ролью "администратор" имеют доступ к этой странице.

**Пример запроса API для получения всех пользователей:**

GET: `/api/user/get/getAllUsers`
Authorization: `Bearer <your_access_token>`

**Пример ответа API:**

```json
{
  "users": [
    {
      "id": 1,
      "login": "user1",
      "role": "администратор",
      "createdAt": "2024-06-21T12:00:00Z",
      "employee": {
        "fullName": "Иван Иванов",
        "workPhone": "+79991234567",
        "personalPhone": "+79997654321"
      }
    },
    {
      "id": 2,
      "login": "user2",
      "role": "специалист",
      "createdAt": "2024-06-22T15:00:00Z",
      "employee": {
        "fullName": "Петр Петров",
        "workPhone": "+79991234658",
        "personalPhone": "+79997654322"
      }
    }
  ]
}
```

Этот API предоставляет список всех пользователей вместе с деталями, включая логин, роль, время регистрации, а также связанные данные о сотруднике, если это применимо. Пользователь может перейти на страницу каждого пользователя для более детальной информации.


### Управление сотрудниками

#### Компонент: EmployeesPage

Этот компонент отвечает за отображение списка всех сотрудников в системе. Пользователи могут просматривать, добавлять новых сотрудников или управлять существующими записями.

**Пример запроса API для получения всех сотрудников:**

GET: `/api/employee/get/getAllEmployees`
Authorization: `Bearer <your_access_token>`

**Пример ответа API:**

```json
{
  "employees": [
    {
      "id": 1,
      "fullName": "Иван Иванов",
      "gender": "Мужской",
      "rank": "Менеджер",
      "workPhone": "+79991234567",
      "personalPhone": "+79997654321",
      "entryDate": "2024-06-21T12:00:00Z"
    },
    {
      "id": 2,
      "fullName": "Петр Петров",
      "gender": "Мужской",
      "rank": "Специалист",
      "workPhone": "+79991234658",
      "personalPhone": "+79997654322",
      "entryDate": "2024-06-22T15:00:00Z"
    }
  ]
}
```

### Управление сотрудниками

#### Компонент: NewEmployeeModal

Этот компонент представляет собой модальное окно, используемое для добавления новых сотрудников в систему. Он позволяет пользователям вводить все необходимые данные сотрудника, включая ФИО, контактные данные, информацию о рабочем времени, и многое другое.

**Пример запроса API для добавления нового сотрудника:**

POST: `/api/employee/post/addEmployee`
Content-Type: `application/json`
Authorization: `Bearer <your_access_token>`
Body:
```json
{
  "fullName": "Иван Иванов",
  "shortName": "И. Иванов",
  "gender": "Мужской",
  "timeWork": "09:00-18:00",
  "shift": "1",
  "workPhone": "+79991234567",
  "personalPhone": "+79997654321",
  "rankNumber": "123",
  "section": "ЦУ-1",
  "rank": "специалист",
  "workStatus": "Активен",
  "extraShift": "Нет",
  "studyTime": "2 часа в день",
  "workTimeChange": "По запросу",
  "internship": true,
  "userId": 1
}
```

**Пример запроса API для добавления нового сотрудника:**
```json
{
  "message": "Employee created successfully",
  "employee": {
    "id": 10,
    "fullName": "Иван Иванов",
    "shortName": "И. Иванов",
    "gender": "Мужской",
    "timeWork": "09:00-18:00",
    "shift": "1",
    "workPhone": "+79991234567",
    "personalPhone": "+79997654321",
    "rankNumber": "123",
    "section": "ЦУ-1",
    "rank": "специалист",
    "workStatus": "Активен",
    "extraShift": "Нет",
    "studyTime": "2 часа в день",
    "workTimeChange": "По запросу",
    "internship": true,
    "entryDate": "2024-06-21T12:00:00Z",
    "createdAt": "2024-06-21T12:00:00Z",
    "updatedAt": "2024-06-21T12:00:00Z"
  }
}
```

Все детальные описания API запросов и их параметры можно найти в папке api проекта. Эта папка содержит различные подпапки, соответствующие различным модулям и функциональностям системы. Каждый файл в этих подпапках описывает конкретный API запрос, его метод, требуемые данные и формат ответа, что обеспечивает удобный доступ к информации для разработчиков и системных администраторов для интеграции и поддержки функциональности веб-сервиса.


## Поток данных в системе и алгоритмы расчета

### Построение графа для расчета времени передвижения между станциями метро

Данный документ описывает процесс построения графа, используемого для расчета времени передвижения между станциями метро и времени на пересадки. Граф строится на основе данных о станциях, соединениях между станциями и времени пересадок.

## Исходные данные
Исходные данные включают в себя три основных файла JSON:
1. `metroStations.json` - содержит информацию о станциях метро.
2. `metroBetweenStationsTime.json` - содержит информацию о времени передвижения между станциями.
3. `metroIntersectionTime.json` - содержит информацию о времени пересадок между линиями.

## Структура данных
### Станция (Station)
- `id`: уникальный идентификатор станции.
- `id_line`: идентификатор линии метро.
- `name_station`: название станции.

### Соединение (Connection)
- `id_st1`: идентификатор первой станции.
- `id_st2`: идентификатор второй станции.
- `time`: время в минутах между станциями.

### Пересечение (Intersection)
- `id1`: идентификатор первой станции пересадки.
- `id2`: идентификатор второй станции пересадки.
- `time`: время пересадки в минутах.

## Построение графа
Функция `buildGraph` создает граф на основе данных из указанных файлов JSON. Граф представляет собой словарь, где ключами являются идентификаторы станций, а значениями - другие словари, указывающие соединения и время перехода.

### Процесс
1. Для каждой станции создается ключ в графе.
2. Для каждого соединения между станциями устанавливается время передвижения в обоих направлениях.
3. Для каждого пересечения устанавливается время пересадки.

## API маршрут
Маршрут API `GET` запускает функцию `buildGraph`, которая возвращает построенный граф. В случае успеха возвращается статус 200 с графом, в случае неудачи - статус 500.

## Использование
Данный граф может быть использован для оптимизации маршрутов передвижения в приложениях метрополитена, позволяя рассчитывать оптимальные пути и время передвижения между станциями.

## Описание процесса
Создание расписания для сотрудников выполняется ежедневно только на следующий день. Это гарантирует, что расписание будет отражать текущие потребности и доступность ресурсов. Данная система позволяет легко адаптировать расписание под изменения в будущем.

## Метод создания расписания и распределения заявок по сотрудникам

Вызывается запросом на `api/schedule/get/generateEmployeeSchedules`
### Основные функции:

- `getCurrentISODateInMoscow()`: Возвращает текущую дату и время в формате ISO с учетом временного сдвига для Москвы (+3 часа к UTC).
- `getCurrentDateInMoscow()`: Возвращает объект `Date` с текущей датой и временем, скорректированным под московский часовой пояс.
- `getStartOfDayInMoscow(date: Date)`: Возвращает объект `Date` с началом дня в Москве для заданной даты.
- `getEndOfDayInMoscow(date: Date)`: Возвращает объект `Date` с концом дня в Москве для заданной даты.
- `getTomorrowInMoscow()`: Возвращает объект `Date` для следующего дня от текущей даты в Москве.

### Помощники:

- `getAppById(appId: number)`: Возвращает данные заявки по её ID.
- `getStationById(stationId: number)`: Возвращает данные станции по её ID.
- `fetchAndSortApplicationsForDay(day: Date)`: Извлекает и сортирует заявки на заданный день.

### Основной процесс создания расписания:

- `assignApplicationsToWorkers()`: Основная функция для назначения заявок работникам. Включает следующие шаги:
  - Определение рабочей группы на следующий день.
  - Фильтрация доступных работников по смене.
  - Распределение заявок среди доступных работников.
  - Проверка на перекрытие рабочих часов, перерывов и уже назначенных задач.
  - Сохранение назначений в базу данных.
  
### Вспомогательные функции:

- `isWorkerAvailable(worker, application, assignments)`: Проверяет, доступен ли работник для выполнения заявки. Учитывает рабочее время, перерывы и уже назначенные задачи.
- `deleteAssignmentsForDay(day: Date)`: Удаляет все задачи, назначенные на определенный день, перед созданием нового расписания.

## Технологии
- API реализовано с использованием Node.js и фреймворка Next.js.
- База данных управляется через Prisma ORM, что обеспечивает гибкость в запросах и управлении данными.

## Заключение
Система создания расписания максимально автоматизирована и может быть адаптирована под изменяющиеся условия работы, что делает её удобной и функциональной для управления персоналом в динамичной рабочей среде.