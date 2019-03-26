#!/bin/sh
psql -h localhost -d merakidb -U postgres -p 5432 -a -W -f ../queries/init.sql