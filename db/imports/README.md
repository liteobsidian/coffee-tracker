# Пакет imports - группа скриптов для начальной загрузки или обновления справочных данных системы stat-app

## Скрипт loader_mo_organization.js выполняет загрузку/обновление эталонного справочника медицинских организаций
Поля справочника в формате CSV разделенные знаком ';'
Заголовок CSV файла
0 OID медицинской организации;
1 Полное наименование медицинской организации;
2 Наименование субъекта системы здравоохранения;
3 Наименование региона РФ
Пример одной записи:
1.2.643.5.1.13.13.12.2.48.4484;Государственное учреждение здравоохранения "Липецкий областной перинатальный центр";Медицинская организация;Липецкая область

Для работы скрипта файл разместить по адресу:
./file_for_loading/mo_organization.csv

## Скрипт loader_division.js выполняет загрузку/обновление эталонного справочника подразделений медицинских организаций
Первичный запуск скрипта выполненит добавление записей, все последующие запуски скрипта осуществляют обновление имеющихся 
записей о подразделениях или добавление новых записей на основании данных эталонного справочника.

Поля справочника в формате CSV разделенные знаком ';'
Заголовок CSV файла
0 OID медицинской организации;
1 Полное наименование медицинской организации;
2 Наименование субъекта системы здравоохранения;
3 Наименование региона РФ;
4 OID структурного подразделения;
5 Наименование структурного подразделения

## Скрипт loader_once_auth_position.js выполняет перенос справочника должностей из системы farm.app
Предварительно сделан экспорт данных в формате CSV из системы farm.app, таблица auth_position
Файл записан по адресу ./file_for_loading/farm_auth_position.csv
Для выполнения операций загрузки начальных данных требуется отключить ограничения Constraints на поле id
по завершению загрузки включить ограничение на поле ID 
NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 )

## Скрипт loader_finance_source.js выполняет загрузку/обновление справочника источники финансирования
Файл для импорта размещен по адресу:
./file_for_loading/finance_source.csv

Поля справочника в формате CSV разделенные знаком ';'
Заголовок CSV
// 0 name;
// 1 b_date;
// 2 e_date;
Поиск значений для обновления осуществляется на основании сравнения значений поля name
В случае совпадения при поиске значения name из эталонного справочника в БД - 
обновляются все поля name, b_date, e_date - значениями установленными в загружаемом файле.
В случае не удачного поиска, скрипт добавляет новую запись в таблицу finance_source БД stat.


