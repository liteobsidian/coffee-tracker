CREATE OR REPLACE FUNCTION stat.get_mobilphone(IN in_phone text)
    RETURNS text
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
    
AS $BODY$
DECLARE 
    temp_phone text;
BEGIN
    IF in_phone ~ '9\d{9}' THEN
        temp_phone = in_phone;
    ELSE
        temp_phone = set_mobilphone(in_phone);
    END IF;
	if temp_phone > '' then
        RETURN '+7 (' || substr(temp_phone,1,3) || ') ' || substr(temp_phone,4,3) || '-' || substr(temp_phone,7,2) || '-' || substr(temp_phone,9,2);
	ELSE
		RETURN '';
	END IF;
EXCEPTION
	WHEN others THEN RAISE EXCEPTION '%', sqlerrm;
END;
$BODY$;