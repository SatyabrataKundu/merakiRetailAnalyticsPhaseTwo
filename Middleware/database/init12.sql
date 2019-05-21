-- Table: meraki.mvsense_restapi_data

-- DROP TABLE meraki.mvsense_restapi_data;

CREATE TABLE meraki.mvsense_restapi_data
(
    start_date bigint,
    end_date bigint,
    average_count numeric(16,3),
    entrances integer,
    zone_id integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.mvsense_restapi_data
    OWNER to postgres;