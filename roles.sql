-- Papéis do PostgREST local. No Supabase cloud isso já vem pronto.
create role anon nologin;
create role authenticated nologin;
create role authenticator noinherit login password :'auth_password';

grant anon to authenticator;
grant authenticated to authenticator;

grant usage on schema public to anon, authenticated;
grant insert on public.inscricoes, public.respostas_teste to anon;
