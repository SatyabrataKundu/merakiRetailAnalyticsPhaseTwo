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