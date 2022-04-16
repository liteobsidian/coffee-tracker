-- Table: stat.template

-- DROP TABLE stat.template;

CREATE TABLE stat.template
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    type_report_id bigint,
    name text COLLATE pg_catalog."default" NOT NULL,
    schema_validation jsonb,
    template_file text COLLATE pg_catalog."default" NOT NULL,
    deleted boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    period date,
    e_date date,
    CONSTRAINT template_pkey PRIMARY KEY (id),
    CONSTRAINT template_unique_constraint_id_period UNIQUE (id, period),
    CONSTRAINT template_unique_constraint_type_period UNIQUE (type_report_id, period),
    CONSTRAINT template_type_report_id_fkey FOREIGN KEY (type_report_id)
        REFERENCES stat.type_report (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE stat.template
    OWNER to stat;

COMMENT ON TABLE stat.template
    IS 'Шаблон';

COMMENT ON COLUMN stat.template.id
    IS 'Ид. шаблона';

COMMENT ON COLUMN stat.template.type_report_id
    IS 'Ид. типа/вида отчетности';

COMMENT ON COLUMN stat.template.name
    IS 'Наименование шаблона';

COMMENT ON COLUMN stat.template.schema_validation
    IS 'Схема валидации полей в таблице шаблона';

COMMENT ON COLUMN stat.template.template_file
    IS 'Имя файл шаблона в формате xlsx';

COMMENT ON COLUMN stat.template.deleted
    IS 'Признак удаления записи шаблона';

COMMENT ON COLUMN stat.template.created_at
    IS 'Дата записи';

COMMENT ON COLUMN stat.template.deleted_at
    IS 'Дата удаления';

COMMENT ON COLUMN stat.template.period
    IS 'Период актуализации шаблона, действующие значения год и месяц предоставления отчетов';

COMMENT ON COLUMN stat.template.e_date
    IS 'Дата окончания действия шаблона';

-- Rule: delete_stat_template ON stat.template

-- DROP Rule delete_stat_template ON stat.template;

CREATE OR REPLACE RULE delete_stat_template AS
    ON DELETE TO stat.template
    DO INSTEAD
(UPDATE template SET deleted = true, deleted_at = now()
  WHERE (template.id = old.id));