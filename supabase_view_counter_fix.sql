-- Execute this SQL in the Supabase SQL Editor:
CREATE OR REPLACE FUNCTION increment_views() RETURNS TRIGGER AS $$ BEGIN NEW.views = OLD.views + 1; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS increment_views_trigger ON listings_views;
CREATE TRIGGER increment_views_trigger BEFORE UPDATE ON listings_views FOR EACH ROW EXECUTE FUNCTION increment_views();
