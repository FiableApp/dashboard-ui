import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,     // project URL
  process.env.SUPABASE_SERVICE_ROLE_KEY!     // PRIVATE KEY – server only
);
