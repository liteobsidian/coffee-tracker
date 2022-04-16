CREATE FUNCTION stat.organization_before_insert_or_update()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    NEW.index = NEW.full_name || ' ' || NEW.inn || ' ' || NEW.ogrn || ' ' || NEW.kpp;
	return NEW;
end;
$BODY$;

ALTER FUNCTION stat.organization_before_insert_or_update()
    OWNER TO stat;

COMMENT ON FUNCTION stat.organization_before_insert_or_update()
    IS 'Триггерная функция для автоматического заполнения поля index (полное наименование, ИНН, ОГРН)';





CREATE TABLE stat.organization
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name text COLLATE pg_catalog."default" NOT NULL,
    short_name text COLLATE pg_catalog."default" NOT NULL,
    full_name text COLLATE pg_catalog."default",
    prefix character varying(3) COLLATE pg_catalog."default",
    inn character varying(12) COLLATE pg_catalog."default",
    kpp character varying(9) COLLATE pg_catalog."default",
    ogrn character varying(15) COLLATE pg_catalog."default",
    details jsonb,
    contacts jsonb,
    legal_address jsonb DEFAULT '{"fias": "true", "flat": "", "house": "", "aoguid": "", "houseguid": "", "post_code": "", "full_address": ""}'::jsonb,
    post_address jsonb DEFAULT '{"fias": "true", "flat": "", "house": "", "aoguid": "", "houseguid": "", "post_code": "", "full_address": ""}'::jsonb,
    bank_details jsonb,
    sys_id character varying(36) COLLATE pg_catalog."default",
    type smallint DEFAULT 0,
    type_ip boolean DEFAULT false,
    deleted boolean NOT NULL DEFAULT false,
    index character varying(500) COLLATE pg_catalog."default",
    oid character varying(50) COLLATE pg_catalog."default",
    federal_subject_id character(2) COLLATE pg_catalog."default",
    client_id character varying(36) COLLATE pg_catalog."default",
    client_secret character varying(36) COLLATE pg_catalog."default",
    sb_client_secret character varying(36) COLLATE pg_catalog."default",
    sb_client_id character varying(36) COLLATE pg_catalog."default",
    sandbox boolean DEFAULT true,
    pharmacy_oid character varying(50) COLLATE pg_catalog."default",
    name_subject_mo text COLLATE pg_catalog."default",
    list_oid text[] COLLATE pg_catalog."default",
    CONSTRAINT organization_pkey PRIMARY KEY (id),
    CONSTRAINT organization_federal_subject_id_fkey FOREIGN KEY (federal_subject_id)
        REFERENCES stat.federal_subject (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE stat.organization
    OWNER to stat;

COMMENT ON COLUMN stat.organization.list_oid
    IS 'Список oid организации';

COMMENT ON TABLE stat.organization
    IS 'Справочник организаций';

COMMENT ON COLUMN stat.organization.id
    IS 'Уникальный ключ (id) для организаций';

COMMENT ON COLUMN stat.organization.name
    IS 'Общеупотребительное наименование организации. Используется в списках выбора';

COMMENT ON COLUMN stat.organization.short_name
    IS 'Сокращенное официальное наименование организации';

COMMENT ON COLUMN stat.organization.full_name
    IS 'Полное официальное наименование организации';

COMMENT ON COLUMN stat.organization.prefix
    IS 'Префикс организации';

COMMENT ON COLUMN stat.organization.inn
    IS 'ИНН организации';

COMMENT ON COLUMN stat.organization.kpp
    IS 'КПП организации';

COMMENT ON COLUMN stat.organization.ogrn
    IS 'ОГРН/ОГРНИП организации (ИП)';

COMMENT ON COLUMN stat.organization.details
    IS 'Дополнительные детали и реквизиты организации';

COMMENT ON COLUMN stat.organization.contacts
    IS 'Контакты организации, обязательные поля - email и phone';

COMMENT ON COLUMN stat.organization.legal_address
    IS 'Юридический адрес организации';

COMMENT ON COLUMN stat.organization.post_address
    IS 'Почтовый адрес организации';

COMMENT ON COLUMN stat.organization.bank_details
    IS 'Банковские реквизиты организации';

COMMENT ON COLUMN stat.organization.sys_id
    IS 'Уникальный ИД организации в системе МДЛП';

COMMENT ON COLUMN stat.organization.type
    IS 'Тип организации. 0 - свои организации, 1 - контрагенты';

COMMENT ON COLUMN stat.organization.type_ip
    IS 'Признак индивидуального предпринимателя';

COMMENT ON COLUMN stat.organization.client_id
    IS 'Идентификатор учетной системы для организцаии в системе МДЛП';

COMMENT ON COLUMN stat.organization.client_secret
    IS 'Секретный код учетной системы для организации в системе МДЛП';

COMMENT ON COLUMN stat.organization.sb_client_secret
    IS 'Секретный код учетной системы для организации в системе МДЛП (тестовый контур)';

COMMENT ON COLUMN stat.organization.sb_client_id
    IS 'Идентификатор учетной системы для организации в системе МДЛП (тестовый контур)';

COMMENT ON COLUMN stat.organization.sandbox
    IS 'Признак ратобы в тестовом контуре системы МДЛП';

COMMENT ON COLUMN stat.organization.pharmacy_oid
    IS 'OID фармацевтической организации';
-- Index: organization_inn_btree_idx

-- DROP INDEX stat.organization_inn_btree_idx;

CREATE INDEX organization_inn_btree_idx
    ON stat.organization USING btree
    (inn COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

COMMENT ON INDEX stat.organization_inn_btree_idx
    IS 'Индекс для поиска по точному совпадению ИНН в таблице организации';
-- Index: organization_kpp_btree_idx

-- DROP INDEX stat.organization_kpp_btree_idx;

CREATE INDEX organization_kpp_btree_idx
    ON stat.organization USING btree
    (kpp COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

COMMENT ON INDEX stat.organization_kpp_btree_idx
    IS 'Индекс для поиска по точному совпадению КПП в таблице организации';
-- Index: organization_name_btree_idx

-- DROP INDEX stat.organization_name_btree_idx;

CREATE INDEX organization_name_btree_idx
    ON stat.organization USING btree
    (stat.normalize_string(name::text) COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

COMMENT ON INDEX stat.organization_name_btree_idx
    IS 'Индекс для поиска по полному совпадению наименования в таблице организации';
-- Index: organization_name_gin_idx

-- DROP INDEX stat.organization_name_gin_idx;

CREATE INDEX organization_name_gin_idx
    ON stat.organization USING gin
    (stat.normalize_string(name::text) COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

COMMENT ON INDEX stat.organization_name_gin_idx
    IS 'Индекс для поиска по вхождению подстроки в наименование в таблице организации';
-- Index: organization_oid_btree_idx

-- DROP INDEX stat.organization_oid_btree_idx;

CREATE INDEX organization_oid_btree_idx
    ON stat.organization USING btree
    (oid COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

COMMENT ON INDEX stat.organization_oid_btree_idx
    IS 'Индекс для поиска по точному совпадению OID в таблице организации';

-- Trigger: organization_before_insert_or_update

-- DROP TRIGGER organization_before_insert_or_update ON stat.organization;

CREATE TRIGGER organization_before_insert_or_update
    BEFORE INSERT OR UPDATE 
    ON stat.organization
    FOR EACH ROW
    EXECUTE PROCEDURE stat.organization_before_insert_or_update();


ALTER TABLE stat.organization
ADD COLUMN name_subject_mo text COLLATE pg_catalog."default";

COMMENT ON COLUMN stat.organization.name_subject_mo
    IS 'Наименование субъекта системы здравоохранения';

ALTER TABLE stat.organization
ADD COLUMN idx_in_report bigint;

COMMENT ON COLUMN stat.organization.idx_in_report
    IS 'Индекс включения данных организации в общий отчет.';