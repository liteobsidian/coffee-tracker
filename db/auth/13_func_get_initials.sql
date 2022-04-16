CREATE OR REPLACE FUNCTION stat.get_initials(IN fullname jsonb)
    RETURNS text
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
    
AS $BODY$
BEGIN
    RETURN UPPER(LEFT(COALESCE(fullname ->> 'first_name','n'),1) || LEFT(COALESCE(fullname ->> 'middle_name','n'),1));
EXCEPTION
    WHEN others THEN RAISE EXCEPTION '%', sqlerrm;
END;
$BODY$;