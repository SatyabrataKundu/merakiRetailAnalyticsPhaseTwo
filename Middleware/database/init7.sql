CREATE TABLE meraki.visitor_predictions
(
    person_oid integer,
    zoneid integer,
    datetime bigint,
    dateformat_date character varying(12) COLLATE pg_catalog."default",
    dateformat_year integer,
    dateformat_month integer,
    dateformat_week integer,
    dateformat_day integer,
    dateformat_hour integer,
    dateformat_minute integer,
    rush_hour boolean,
    shop_closed boolean,
    day_of_week character varying(10) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.visitor_predictions
    OWNER to postgres;