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