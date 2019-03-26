CREATE SEQUENCE meraki.camera_detections_key_seq;

CREATE TABLE meraki.camera_detections
(
    unique_camera_detection_key integer NOT NULL DEFAULT nextval('meraki.camera_detections_key_seq'::regclass),
    person_oid integer,
    zoneId integer,
    datetime character varying COLLATE pg_catalog."default",
    dateformat_date character varying(12) COLLATE pg_catalog."default",
	dateformat_year integer DEFAULT 2019,
    dateformat_month integer,
    dateformat_week integer,
    dateformat_day integer,
    dateformat_hour integer,
    dateformat_minute integer,
    CONSTRAINT camera_detections_primary_key PRIMARY KEY (unique_camera_detection_key)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.camera_detections
    OWNER to postgres;