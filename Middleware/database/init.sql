CREATE SCHEMA meraki;

CREATE SEQUENCE meraki.scanning_ap_data_unique_scanning_key_seq;

CREATE TABLE meraki.scanning_ap_data
(
    unique_scanning_key integer NOT NULL DEFAULT nextval('meraki.scanning_ap_data_unique_scanning_key_seq'::regclass),
    ap_mac_address character varying(80) COLLATE pg_catalog."default",
	client_mac_address character varying(80) COLLATE pg_catalog."default",
    datetime character varying COLLATE pg_catalog."default",
    dateformat_date character varying(12) COLLATE pg_catalog."default",
	dateformat_year integer DEFAULT 2019,
    dateformat_month integer,
    dateformat_week integer,
    dateformat_day integer,
    dateformat_hour integer,
    dateformat_minute integer,
	rssi integer,
	seen_epoch character varying COLLATE pg_catalog."default",
    CONSTRAINT scanning_ap_data_pkey PRIMARY KEY (unique_scanning_key)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.scanning_ap_data
    OWNER to postgres;
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

CREATE SEQUENCE meraki.scanning_visitor_info_count_seq;

CREATE TABLE meraki.scanning_visitorinfo
(
    visitor_count integer,
    datetime character varying(20) COLLATE pg_catalog."default",
    scanning_visitorinfo_uniq_key integer DEFAULT nextval('meraki.scanning_visitor_info_count_seq'::regclass)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.scanning_visitorinfo
    OWNER to postgres;
COMMENT ON TABLE meraki.scanning_visitorinfo
    IS 'This table will contain visitor count at any given time( this will be sum of visitors from all the 4 APs)';

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


CREATE TABLE meraki.meraki_zones
(
    zone_id integer,
    zone_name character varying(80) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.meraki_zones
    OWNER to postgres;


insert into meraki.meraki_zones (zone_id, zone_name) values (1, 'Entry');
insert into meraki.meraki_zones (zone_id, zone_name) values (2, 'Checkout1');
insert into meraki.meraki_zones (zone_id, zone_name) values (3, 'Checkout2');
insert into meraki.meraki_zones (zone_id, zone_name) values (4, 'Checkout3');
insert into meraki.meraki_zones (zone_id, zone_name) values (5, 'Checkout4');
insert into meraki.meraki_zones (zone_id, zone_name) values (6, 'Checkout5');
insert into meraki.meraki_zones (zone_id, zone_name) values (7, 'Kids');
insert into meraki.meraki_zones (zone_id, zone_name) values (8, 'Grocery');
insert into meraki.meraki_zones (zone_id, zone_name) values (9, 'Apparel');
insert into meraki.meraki_zones (zone_id, zone_name) values (10, 'Furniture');
insert into meraki.meraki_zones (zone_id, zone_name) values (11, 'Electronics');
insert into meraki.meraki_zones (zone_id, zone_name) values (12, 'Exit');

CREATE TABLE meraki.checkoutzone_billingcounter_map
(
    zone_id integer,
    pos_counter_number integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.checkoutzone_billingcounter_map
    OWNER to postgres;
    
INSERT INTO meraki.checkoutzone_billingcounter_map(
	zone_id, pos_counter_number)
	VALUES (2, 1);
INSERT INTO meraki.checkoutzone_billingcounter_map(
	zone_id, pos_counter_number)
	VALUES (3, 2);
INSERT INTO meraki.checkoutzone_billingcounter_map(
	zone_id, pos_counter_number)
	VALUES (4, 3);
INSERT INTO meraki.checkoutzone_billingcounter_map(
	zone_id, pos_counter_number)
	VALUES (5, 4);
INSERT INTO meraki.checkoutzone_billingcounter_map(
	zone_id, pos_counter_number)
	VALUES (6, 5);

ALTER TABLE meraki.pos_data ALTER COLUMN datetime TYPE bigint USING (datetime::bigint);
ALTER TABLE meraki.camera_detections ALTER COLUMN datetime TYPE bigint USING (datetime::bigint);

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


drop table meraki.daily_visitor_predictions;
drop table meraki.hourly_visitor_predictions;