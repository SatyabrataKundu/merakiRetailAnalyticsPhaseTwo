
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