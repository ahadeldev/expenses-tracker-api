-- craete database
CREATE DATABASE expenses_tracker;

-- create database user
CREATE USER exps_user WITH PASSWORD 'exps_pass';

-- grant privileges on All tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO exps_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO exps_user;

-- grant permissions
GRANT USAGE ON SCHEMA public TO exps_user;
GRANT CREATE ON SCHEMA public TO exps_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO exps_user;
