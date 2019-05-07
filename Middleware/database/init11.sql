CREATE TABLE meraki.visitor_data_without_oid
(
    visitor_count integer,
    datetime bigint,
    dateformat_date character varying(12) COLLATE pg_catalog."default",
    dateformat_year integer,
    dateformat_month integer,
    dateformat_week integer,
    dateformat_day integer,
    dateformat_hour integer,
    dateformat_minute integer,
    day_of_week character varying(10) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.visitor_data_without_oid
    OWNER to postgres;