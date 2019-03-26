ALTER TABLE meraki.pos_data ALTER COLUMN datetime TYPE bigint USING (datetime::bigint);
ALTER TABLE meraki.camera_detections ALTER COLUMN datetime TYPE bigint USING (datetime::bigint);