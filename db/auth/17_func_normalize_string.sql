CREATE OR REPLACE FUNCTION stat.normalize_string(IN in_string text)
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

CREATE OR REPLACE FUNCTION stat.normalize_index_expression(IN in_string text,IN in_id text,IN in_l integer)
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

CREATE OR REPLACE FUNCTION stat.normalize_index_expression(IN in_string text,IN in_id bigint,IN in_l integer)
    RETURNS text
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
    
AS $BODY$
BEGIN
    RETURN rpad(normalize_string(in_string),in_l,' ') || lpad(in_id::text,20,'0');
END;
$BODY$;