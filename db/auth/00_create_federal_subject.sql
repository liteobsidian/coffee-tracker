CREATE OR REPLACE FUNCTION stat.stat.normalize_string(IN in_string text)
    RETURNS text
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
BEGIN
    RETURN replace(upper(trim(in_string)),'Ё','Е');
END;
$BODY$;

CREATE OR REPLACE FUNCTION stat.stat.normalize_index_expression(IN in_string text,IN in_id text,IN in_l integer)
    RETURNS text
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
BEGIN
    RETURN rpad(stat.normalize_string(in_string),in_l,' ') || lpad(in_id,20,'0');
END;
$BODY$;


-- Table: stat.federal_subject

-- DROP TABLE stat.federal_subject;

CREATE TABLE stat.federal_subject
(
    id character(2) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT federal_subject_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE stat.federal_subject
    OWNER to stat;

COMMENT ON TABLE stat.federal_subject
    IS 'Справочник федеральных субъектов';

COMMENT ON COLUMN stat.federal_subject.id
    IS 'Код федерального субъекта';

COMMENT ON COLUMN stat.federal_subject.name
    IS 'Наименование федерального субъекта';
-- Index: federal_subject_name_btree_idx

-- DROP INDEX stat.federal_subject_name_btree_idx;

CREATE INDEX federal_subject_name_btree_idx
    ON stat.federal_subject USING btree
    (stat.normalize_string(name::text) COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

COMMENT ON INDEX stat.federal_subject_name_btree_idx
    IS 'Индекс для поиска по полному совпадению наименования в таблице субъектов РФ';
-- Index: federal_subject_name_gin_idx

-- DROP INDEX stat.federal_subject_name_gin_idx;

CREATE INDEX federal_subject_name_gin_idx
    ON stat.federal_subject USING gin
    (stat.normalize_string(name::text) COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

COMMENT ON INDEX stat.federal_subject_name_gin_idx
    IS 'Индекс для поиска по вхождению подстроки в наименование в таблице субъектов РФ';
-- Index: federal_subject_page_navigation_btree_idx

-- DROP INDEX stat.federal_subject_page_navigation_btree_idx;

CREATE INDEX federal_subject_page_navigation_btree_idx
    ON stat.federal_subject USING btree
    (stat.normalize_index_expression(name::text, id::text, 50) COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

COMMENT ON INDEX stat.federal_subject_page_navigation_btree_idx
    IS 'Индекс для постраничной навигации в таблице субъектов РФ';