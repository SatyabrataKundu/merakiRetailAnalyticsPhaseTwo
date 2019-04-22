CREATE TABLE meraki.hourly_visitor_predictions
(
    dateformat_hour integer,
    count integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.hourly_visitor_predictions
    OWNER to postgres;