DROP TABLE meraki.daily_visitor_predictions;

CREATE TABLE meraki.daily_visitor_predictions
(
    dateformat_day integer,
    count integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.daily_visitor_predictions
    OWNER to postgres;