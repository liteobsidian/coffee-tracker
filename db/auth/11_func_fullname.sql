CREATE OR REPLACE FUNCTION stat.get_fullname(IN in_fullname jsonb,IN mode integer DEFAULT 0)
    RETURNS text
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
    
AS $BODY$
DECLARE
    lname text;
    fname text;
    mname text;
    result text default '';
BEGIN
    lname = coalesce(in_fullname->>'last_name', '');
    fname = coalesce(in_fullname->>'first_name', '');
    mname = coalesce(in_fullname->>'middle_name', '');
    result = lname;
    IF mode = 0 then
        IF fname > '' THEN 
            result = result || ' ' || fname;
            IF mname > '' THEN 
                result = result || ' ' || mname;
            END IF;
        END IF;
    ELSE
        IF fname > '' THEN
            IF mname > '' THEN 
                result = fname || ' ' || mname || ' ' || lname;
            ELSE
                result = fname || ' ' || lname;
            END IF;
        END IF;
    END IF;
    RETURN TRIM(result);
EXCEPTION
  WHEN others THEN RAISE EXCEPTION '%', sqlerrm;
END;
$BODY$;