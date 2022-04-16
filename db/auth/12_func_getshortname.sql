CREATE OR REPLACE FUNCTION stat.get_shortname(IN in_fullname jsonb,IN mode integer DEFAULT 0)
    RETURNS text
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
    
AS $BODY$
DECLARE
	initial varchar(4) DEFAULT '';
	fname text;
	lname text;
	mname text;
BEGIN
	fname := coalesce(in_fullname->>'first_name','');
	lname := coalesce(in_fullname->>'last_name','');
	mname := coalesce(in_fullname->>'middle_name','');
	IF fname > '' THEN
		initial := LEFT(fname,1)||'.';
		IF mname > '' THEN
			initial := initial||LEFT(mname,1)||'.';
		END IF;
	END IF;
	IF mode = 0 THEN
		RETURN TRIM(lname || ' ' || initial);
	ELSE
		RETURN TRIM(initial || lname);
	END IF;
EXCEPTION
  WHEN others THEN RAISE EXCEPTION '%', sqlerrm;
END;
$BODY$;