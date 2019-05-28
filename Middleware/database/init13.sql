-- Table: meraki.prediction_value_table

-- DROP TABLE meraki.prediction_value_table;

CREATE TABLE meraki.prediction_value_table
(
    dateformat_date character varying(15) COLLATE pg_catalog."default",
    count integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.prediction_value_table
    OWNER to postgres;