CREATE SEQUENCE meraki.pos_data_key_seq;

CREATE TABLE meraki.pos_data
(
    unique_pos_data_key integer NOT NULL DEFAULT nextval('meraki.pos_data_key_seq'::regclass),
    no_of_items integer,
    total_amount integer,
    pos_counter_number integer,
    datetime character varying COLLATE pg_catalog."default",
    dateformat_date character varying(12) COLLATE pg_catalog."default",
	dateformat_year integer DEFAULT 2019,
    dateformat_month integer,
    dateformat_week integer,
    dateformat_day integer,
    dateformat_hour integer,
    dateformat_minute integer,
    CONSTRAINT pos_data_pkey PRIMARY KEY (unique_pos_data_key)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.pos_data
    OWNER to postgres;

