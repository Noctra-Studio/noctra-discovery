import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types";

type WorkspaceAwareClient = {
  from: (
    table: string,
  ) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        single: () => Promise<{ data: { workspace_id: string | null } | null }>;
      };
    };
  };
};

export async function getCurrentWorkspaceId(
  supabase: WorkspaceAwareClient,
  userId: string,
) {
  const { data } = await (supabase as any)
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .single();

  return data?.workspace_id ?? null;
}

export async function getCurrentWorkspaceContext(
  supabase: {
    auth: {
      getUser: () => Promise<{ data: { user: User | null } }>;
    };
  } & WorkspaceAwareClient,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, workspaceId: null };
  }

  const workspaceId = await getCurrentWorkspaceId(supabase, user.id);
  return { user, workspaceId };
}
