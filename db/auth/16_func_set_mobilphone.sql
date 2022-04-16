CREATE OR REPLACE FUNCTION stat.set_mobilphone(IN in_phone text)
    RETURNS text
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
    
AS $BODY$
DECLARE
	res text DEFAULT '';
BEGIN	
	res := regexp_replace(in_phone,'[^0-9]','','g');
	res := regexp_replace(res,'^79','9','g');
	res := regexp_replace(res,'^89','9','g');
	IF left(res,1)= '9' AND length(res) = 10 THEN
		RETURN res;
	ELSE
		RETURN '';
	END IF;
EXCEPTION
	WHEN others THEN RAISE EXCEPTION '%', sqlerrm;
END;
$BODY$;