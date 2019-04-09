-- Table: meraki.weekly_visitor_predictions

-- DROP TABLE meraki.weekly_visitor_predictions;

CREATE TABLE meraki.weekly_visitor_predictions
(
    dateformat_week integer,
    count integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.weekly_visitor_predictions
    OWNER to postgres;