import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentWorkspaceId } from "@/lib/workspace";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = await getCurrentWorkspaceId(supabase as any, user.id);
    if (!workspaceId) {
      return NextResponse.json(
        { error: "No perteneces a ningún workspace" },
        { status: 403 },
      );
    }

    const payload = await request.json();

    if (!payload.title || !payload.project_name || !payload.client_name) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para crear la propuesta" },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const proposalInsert = {
      ...payload,
      workspace_id: workspaceId,
      public_uuid: payload.public_uuid ?? crypto.randomUUID(),
    };

    const { data: proposal, error } = await admin
      .from("proposals")
      .insert(proposalInsert as any)
      .select("id, client_name")
      .single();

    if (error || !proposal) {
      return NextResponse.json(
        { error: error?.message || "No se pudo crear la propuesta" },
        { status: 500 },
      );
    }

    await admin.from("workspace_activity_events").insert({
      actor_user_id: user.id,
      workspace_id: workspaceId,
      entity_type: "proposal",
      event_type: "proposal.created",
      entity_id: proposal.id,
      title: "Proposal creada",
      description: `${payload.project_name} para ${proposal.client_name}`,
      metadata: {
        proposalId: proposal.id,
      },
    } as any);

    return NextResponse.json(proposal);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
