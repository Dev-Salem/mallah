-- Fixes project submission failures caused by database triggers/webhooks
-- that call net.http_post(...) before the pg_net extension is enabled.
create extension if not exists pg_net;
