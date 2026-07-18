-- Avoid relying on custom Postgres settings that are not present in production.
-- The evaluate-project function does not require JWT verification, so the trigger
-- can call it directly once review_status transitions to pending.
create or replace function public.trigger_project_evaluation()
returns trigger
language plpgsql
security definer
as $function$
begin
  if (tg_op = 'UPDATE' or tg_op = 'INSERT')
     and new.review_status = 'pending'
     and (old is null or old.review_status is distinct from 'pending') then
    perform net.http_post(
      url := 'https://wxelvdwsvkrqhwzhajgr.supabase.co/functions/v1/evaluate-project',
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object('user_project_id', new.id)
    );
  end if;

  return new;
end;
$function$;
