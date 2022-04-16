-- Table: stat.auth_user_socket

-- DROP TABLE stat.auth_user_socket;

CREATE TABLE stat.auth_user_socket
(
    socket character varying(36) COLLATE pg_catalog."default" NOT NULL,
    "time" timestamp without time zone DEFAULT now(),
    auth_user_id bigint,
    CONSTRAINT auth_user_socket_pkey PRIMARY KEY (socket),
    CONSTRAINT auth_user_socket_auth_user_id_fkey FOREIGN KEY (auth_user_id)
        REFERENCES stat.auth_user (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE stat.auth_user_socket
    OWNER to stat;

COMMENT ON TABLE stat.auth_user_socket
    IS 'Справочник, в котором хранятся соотвествия пользователя и открытого сокета';

COMMENT ON COLUMN stat.auth_user_socket.socket
    IS 'Уникальный идентификатор сокета';

COMMENT ON COLUMN stat.auth_user_socket."time"
    IS 'Время установления соединения с сокетом';

COMMENT ON COLUMN stat.auth_user_socket.auth_user_id
    IS 'Уникальный идентификатор пользователя';