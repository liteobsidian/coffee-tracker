-- Table: stat.auth_user_division

-- DROP TABLE stat.auth_user_division;

CREATE TABLE stat.auth_user_division
(
    period date NOT NULL DEFAULT CURRENT_DATE,
    auth_user_id bigint NOT NULL,
    division_id bigint NOT NULL,
    auth_position_id bigint,
    organization_id bigint,
    CONSTRAINT auth_user_division_pkey PRIMARY KEY (period, auth_user_id),
    CONSTRAINT auth_user_division_auth_position_id_fkey FOREIGN KEY (auth_position_id)
        REFERENCES stat.auth_position (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT auth_user_division_auth_user_id_fkey FOREIGN KEY (auth_user_id)
        REFERENCES stat.auth_user (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT auth_user_division_division_id_fkey FOREIGN KEY (division_id)
        REFERENCES stat.division (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT auth_user_division_organization_id_fkey FOREIGN KEY (organization_id)
        REFERENCES stat.organization (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE stat.auth_user_division
    OWNER to stat;

COMMENT ON TABLE stat.auth_user_division
    IS 'Регистр для хранения отношения пользователя к подразделению. Имеет привязку к моменту времени';

COMMENT ON COLUMN stat.auth_user_division.period
    IS 'Дата с которой начинает действовать привязка пользователя к подразделению';

COMMENT ON COLUMN stat.auth_user_division.auth_user_id
    IS 'Ссылка на запись в справочнике пользователей';

COMMENT ON COLUMN stat.auth_user_division.division_id
    IS 'Ссылка на запись в справочнике отделов предприятия (подразделения)';

COMMENT ON COLUMN stat.auth_user_division.auth_position_id
    IS 'Ссылка на запись в справочнике должностей';

COMMENT ON COLUMN stat.auth_user_division.organization_id
    IS 'Ссылка на спарвочник организаций. Нужно для разгарничения доступа';
-- Index: auth_user_division_division_btree_idx

-- DROP INDEX stat.auth_user_division_division_btree_idx;

CREATE INDEX auth_user_division_division_btree_idx
    ON stat.auth_user_division USING btree
    (division_id ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: auth_user_division_period_btree_idx

-- DROP INDEX stat.auth_user_division_period_btree_idx;

CREATE INDEX auth_user_division_period_btree_idx
    ON stat.auth_user_division USING btree
    (period ASC NULLS LAST)
    TABLESPACE pg_default;

COMMENT ON INDEX stat.auth_user_division_period_btree_idx
    IS 'Индекс для отбора и сортировке по дате изменения';
-- Index: auth_user_division_position_btree_idx

-- DROP INDEX stat.auth_user_division_position_btree_idx;

CREATE INDEX auth_user_division_position_btree_idx
    ON stat.auth_user_division USING btree
    (auth_position_id ASC NULLS LAST)
    TABLESPACE pg_default;