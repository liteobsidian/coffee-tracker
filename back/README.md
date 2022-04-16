# Описание API приложения stat-app

## Получение профиля пользователя
curl --location --request POST 'http://localhost:3000/api/v1/user/profile' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsIm5hbWUiOiLQn9C-0L_Rg9GA0LXQuSDQptCV0J3QotCg0KHQn9CY0JQiLCJ0eXBlIjoiYWRtaW4iLCJvcmdhbml6YXRpb24iOjM5NiwiaWF0IjoxNjE3ODc0Mzc5fQ._uGMp_JPIMX7vDeSf0tbdGs2RQXI97i17B2iBtQoXi4' \
--header 'Content-Type: application/json' \
--data-raw ''

РЕЗУЛЬТАТ:
```json
{
    "sucess": true,
    "message": "Профиль пользователя успешно загружен",
    "profile": {
        "id": "22",
        "name": "Попурей ЦЕНТРСПИД",
        "full_name": "Попурей Сергей",
        "short_name": "С.Попурей",
        "initials": "С",
        "organization": {
            "id": 396,
            "name": "Государственное учреждение здравоохранения особого типа \"Центр общественного здоровья и медицинской профилактики\"",
            "full_name": "Государственное учреждение здравоохранения особого типа \"Центр общественного здоровья и медицинской профилактики\"",
            "short_name": "Государственное учреждение здравоохранения особого типа \"Центр общественного здоровья и медицинской профилактики\""
        },
        "type": "admin",
        "mobil_phone": null,
        "avatar": null
    }
}
```

## Получение списка загруженных файлов по организации, за период

```sh
curl --location --request GET 'http://localhost:3000/api/v1/file/2/2?period_s=2021-02-01&period_e=2021-02-2' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Type: application/json'
```

Резельтат:
```json
{
    "success": true,
    "message": "Успешное чтение БД.",
    "items": [
        {
            "shablon": "",
            "organization": "Государственное учреждение здравоохранения \"Липецкий областной Центр по профилактике и борьбе со СПИД и инфекционными заболеваниями\"",
            "uuid": "392f5f20-222a-4500-a320-5a515f2ed46c",
            "file_name": "Данковская ЦРБ _февраль_2021.xls",
            "path_in_system": "uploads\\2021-02\\2\\2_392f5f20-222a-4500-a320-5a515f2ed46c.xls",
            "period": "2021-02-01",
            "status": {
                "handled": false,
                "validation": false
            },
            "user": "2",
            "shortname": "С.Попурей"
        },
        {
            "shablon": "",
            "organization": "Государственное учреждение здравоохранения \"Липецкий областной Центр по профилактике и борьбе со СПИД и инфекционными заболеваниями\"",
            "uuid": "a6ce452a-22a0-405f-aea4-d5b6cf1a3aa1",
            "file_name": "ЛГДБ_февраль_2021.xlsx",
            "path_in_system": "uploads\\2021-02\\2\\2_a6ce452a-22a0-405f-aea4-d5b6cf1a3aa1.xlsx",
            "period": "2021-02-01",
            "status": {
                "handled": false,
                "validation": false
            },
            "user": "2",
            "shortname": "С.Попурей"
        },
        {
            "shablon": "",
            "organization": "Государственное учреждение здравоохранения \"Липецкий областной Центр по профилактике и борьбе со СПИД и инфекционными заболеваниями\"",
            "uuid": "1600d767-74f5-4ec6-9fb2-d178daa5d06b",
            "file_name": "Данковская ЦРБ _февраль_2021.xls",
            "path_in_system": "uploads\\2021-02\\2\\2_1600d767-74f5-4ec6-9fb2-d178daa5d06b.xls",
            "period": "2021-02-01",
            "status": {
                "handled": false,
                "validation": false
            },
            "user": "2",
            "shortname": "С.Попурей"
        }
    ]
}
```
## Запрос на загрузку файла в БД

```json
curl --location --request POST 'http://localhost:3000/api/v1/file/upload' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Type: application/json; charset=utf-8' \
--form 'organization="2"' \
--form 'division=""' \
--form 'type_report="1"' \
--form 'period="2021-02-01 00:00:00"' \
--form 'filename=@"/D:/work/stat-app/db/test_file_for_upload/ЕГБ №2_февраль_2021.xlsx"' \
--form 'name="ЕГБ №2_февраль_2021.xlsx"'
```
Результат:

```json
{"success":true,"message":"Сообщение от сервиса с ID:  доставлено","result":"66"}
```

## Запрос на получение списка организаций.

```sh
curl --location --request GET 'http://localhost:3000/api/v1/organization/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Type: application/json'
```
Результат

```json
{
    "success": true,
    "message": "Успешная загрузка данных БД.",
    "result": [
        {
            "id": "2",
            "name": "Государственное учреждение здравоохранения \"Липецкий областной Центр по профилактике и борьбе со СПИД и инфекционными заболеваниями\"",
            "oid": "1.2.643.5.1.13.13.12.2.48.4486"
        }
    ]
}
```
## Запрос на получение списка организаций удовлетворяющих условию вхождения части слова в наименование.
```sh
curl --location --request GET 'http://localhost:3000/api/v1/organization/филиал' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Type: application/json'
```
Ответ:
```json
{
    "success": true,
    "message": "Успешная загрузка данных БД.",
    "result": [
        {
            "name": "филиал «Медицинская часть № 6» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "филиал «Туберкулезная больница» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "Филиал Общества с ограниченной ответственностью \"Эверест\" г. Елец"
        },
        {
            "name": "филиал «Медицинская часть № 2» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "филиал «Медицинская часть № 7» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "филиал «Больница» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "филиал «Центр медицинской и социальной реабилитации» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "Липецкий филиал Федерального государственного унитарного предприятия «Московское протезно-ортопедическое предприятие» Министерства труда и социальной защиты Российской Федерации"
        },
        {
            "name": "филиал «Медицинская часть № 1» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "филиал «Медицинская часть № 3» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "филиал «Медицинская часть № 4» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "Филиал Общества с ограниченной ответственностью \"Эверест\" с. Колыбельское"
        },
        {
            "name": "филиал «Медицинская часть № 5» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "филиал «Военно-врачебная комиссия» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        },
        {
            "name": "филиал «Центр государственного санитарно-эпидемиологического надзора» федерального казенного учреждения здравоохранения «Медико-санитарная часть № 48 Федеральной службы исполнения наказаний»"
        }
    ]
}
```
## Запрос на удаление файла по его UUID
```sh
curl --location --request DELETE 'http://localhost:3000/api/v1/file/8747a306-edce-4196-80a2-fccb6abb29c5' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Type: application/json'
```
Ответ
```json
{
    "success": true,
    "message": "Успешное удаление файла с UUID:8747a306-edce-4196-80a2-fccb6abb29c5.",
    "itemId": "129"
}
```

## Запрос на загрузку протокола об ошибках
```sh
curl --location --request GET 'http://localhost:3000/api/v1/file/protocol/59c80f04-5ca9-4f39-a2d9-5ed38718fca5' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Transfer-Encoding: application/json'
```
Ответ:
```json
{
    "success": true,
    "message": "Загружен протокол ошибок валидации файла 59c80f04-5ca9-4f39-a2d9-5ed38718fca5",
    "link": "5285b325b0f22fb6ecc2a.xlsx"
}
```
## Запрос на изменение статуса отправки файла в вышестоящую систему
``` sh
curl --location --request PUT 'http://localhost:3000/api/v1/file/status/b83df27a-cb1a-4d7c-b3ee-39f46a1c024c' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Type: application/json'
```
Ответ:
```json
{
    "success": true,
    "message": "Изменен статус разрешения на отправку файла b83df27a-cb1a-4d7c-b3ee-39f46a1c024c в вышестоящую систему",
    "itemId": "198"
}
```
## Запрос на получение СХЕМЫ валидации, в параметрах указать типа отчетности/период.
``` sh
curl --location --request GET 'http://localhost:3000/api/v1/template/schema/1/2021-02-01' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Type: application/json'
```

Ответ в случае наличия записанной в БД схемы валидации данных:
```json
{
    "success": true,
    "message": "Получена схема валидации данных из шаблона в БД.",
    "items": {
        "type": "array",
        "items": {
            "type": "array",
            "items": [
                {
                    "type": "string",
                    "const": "Липецкая область",
                    "title": "0 Область",
                    "examples": [
                        "Липецкая область"
                    ],
                    "description": "наименование области к которой относится медицинская организация"
                },
                {
                    "type": "string",
                    "title": "1 Наименование медицинской организации",
                    "format": "СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ",
                    "description": "Полное официальное наименование медицинской органиазции"
                },
                {
                    "type": "string",
                    "title": "2 OID медорганизации",
                    "format": "СООТВЕТСТВИЕ OID СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ",
                    "description": "OID медицинской организациии в системе ЕГИСЗ"
                },
                {
                    "type": "string",
                    "title": "3 ИНН",
                    "pattern": "[0-9]{10}",
                    "examples": [
                        "4821011419"
                    ],
                    "description": "ИНН медицинской организации"
                },
                {
                    "type": "string",
                    "title": "4 КПП",
                    "pattern": "[0-9]{9}",
                    "examples": [
                        "482101001"
                    ],
                    "description": "КПП медицинской организации"
                },
                {
                    "type": "string",
                    "title": "5 Подразделение",
                    "format": "СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.",
                    "description": "Наименование подразделения (отделения) медицинской организации"
                },
                {
                    "type": "string",
                    "title": "6 OID подразделения",
                    "format": "СООТВЕТСТВИЕ OID СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.",
                    "description": "OID подразделения (отделения) медицинской организации"
                },
                {
                    "enum": [
                        "Январь",
                        "Февраль",
                        "Март",
                        "Апрель",
                        "Май",
                        "Июнь",
                        "Июль",
                        "Август",
                        "Сентябрь",
                        "Октябрь",
                        "Ноябрь",
                        "Декабрь"
                    ],
                    "type": "string",
                    "title": "7 Месяц",
                    "examples": [
                        "Январь"
                    ],
                    "description": "Месяц формирования отчета"
                },
                {
                    "title": "8 Год",
                    "format": "ГОД ПРЕДОСТАВЛЕНИЯ ДАННЫХ",
                    "description": "Год формирования отчета"
                },
                {
                    "type": "string",
                    "title": "9 СНИЛС",
                    "pattern": "[0-9]{11}",
                    "examples": [
                        "04286703865"
                    ],
                    "description": "СНИЛС сотрудника"
                },
                {
                    "type": "string",
                    "title": "10 Должность",
                    "format": "СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ДОЛЖНОСТИ СПРАВОЧНОМУ НАИМЕНОВАНИЮ",
                    "description": "Должность сотрудника"
                },
                {
                    "type": "number",
                    "title": "11 Ставка",
                    "examples": [
                        0.5,
                        1
                    ],
                    "description": "Размер ставки сотрудника"
                },
                {
                    "enum": [
                        "Основное",
                        "Внутреннее совместительство",
                        "Внешнее совместительство"
                    ],
                    "type": "string",
                    "title": "12 Занятость",
                    "examples": [
                        "Основное",
                        "Внутреннее совместительство"
                    ],
                    "description": "Условия занятости сотрудника"
                },
                {
                    "type": "string",
                    "title": "13 Номер договора",
                    "pattern": "^.+$",
                    "description": "Номер трудового договора"
                },
                {
                    "title": "14 Дата договора",
                    "format": "date",
                    "description": "Дата трудового договора"
                },
                {
                    "type": "string",
                    "title": "15 Табельный номер",
                    "pattern": "^.+$",
                    "description": "Табельный номер сотрудника"
                },
                {
                    "type": "string",
                    "title": "16 Источник финасирования",
                    "format": "СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ИСТОЧНИКА ФИНАНСИРОВАНИЯ НА ОТЧЕТНЫЙ ПЕРИОД",
                    "description": "Источник финансирования сотрудника"
                },
                {
                    "title": "17 Продолжительность рабочего времени",
                    "format": "ЧИСЛО",
                    "description": "Продолжительность рабочего времени в неделю (часы)"
                },
                {
                    "type": "number",
                    "title": "18 Норма рабочего времени",
                    "default": 0,
                    "description": "Норма рабочего времени (часы)"
                },
                {
                    "type": "number",
                    "title": "19 Фактическое отработанное время",
                    "default": 0,
                    "description": "Фактическое количество отработанного времени (часы)"
                },
                {
                    "type": "number",
                    "title": "20 Фактическое отработанное время по COVID-19",
                    "default": 0,
                    "description": "Фактическое количество отработанного времени  для начисления выплат за оказание помощи, участвующим в оказании помощи больным Covid-19 ( часы )"
                },
                {
                    "type": "number",
                    "title": "21 Фактическое отработанное время по ПП РФ 415",
                    "default": 0,
                    "description": "Фактическое количество отработанного времени  для начисления выплат по ПП РФ 415 (часы)"
                },
                {
                    "type": "number",
                    "title": "22 Фактическое отработанное время по ПП РФ 484",
                    "default": 0,
                    "description": "Фактическое количество отработанного времени для начисления выплат по ПП РФ 484 (часы)"
                },
                {
                    "type": "number",
                    "title": "23 Должностной оклад",
                    "default": 0,
                    "description": "Должностной оклад"
                },
                {
                    "type": "number",
                    "title": "24",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "25",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "26",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "27",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "28",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "29",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "30",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "31",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "32",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "33",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "34",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "35",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "36",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "37",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "38",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "39",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "40",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "41",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "42",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "43",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "44",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "45",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "46",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "47",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "48",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "49",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "50",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "51",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "52",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "53",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "54",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "55",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "56",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "57",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "58",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "59",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "60",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "61",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "62",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "63",
                    "default": 0
                },
                {
                    "type": "number",
                    "title": "64",
                    "default": 0
                }
            ]
        }
    }
}
```
Ответ, в случае отсутствия записанной схемы валидации данных 
```json
{}
```
## Запрос на формирование сводного файла по всем организациям за период для установленного типа отчетности {"type_report":"1","period":"2021-02-01"}

```sh
curl --location --request POST 'http://localhost:3000/api/v1/output_file' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Type: application/json' \
--data-raw '{"type_report":"1","period":"2021-02-01"}'
```
```json
{
    "success": true,
    "message": "Сформирован сводный файл для отправки информации в вышестоящую организациюи",
    "link": "8427be07fd1f9b301aa7d.xlsx"
}
```

## Запрос на скачивание ранее загруженного файла по его uuid
```sh
curl --location --request GET 'http://localhost:3000/api/v1/file/getfile/9a3400a7-efdf-4eec-86d5-c728608e6343' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6ItCf0L7Qv9GD0YDQtdC5INCm0JXQndCi0KDQodCf0JjQlCIsInR5cGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbiI6MiwiaWF0IjoxNjE3NzkwMzA5fQ.P4pWABfEEbWC297GGkotRH0t46Pmi9p7ocYeW_VFPec' \
--header 'Content-Type: application/json'
```
