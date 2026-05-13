import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSlug } from "@/lib/utils";
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
    if (!payload.proposal_id || !payload.project_name || !payload.client_name) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para crear el contrato" },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const slug = generateSlug(payload.project_name, "cont");

    const contractInsert = {
      ...payload,
      slug,
      workspace_id: workspaceId,
      total_price: payload.total_price ?? payload.total,
    };

    const { data: contract, error } = await admin
      .from("contracts")
      .insert(contractInsert as any)
      .select("id, proposal_id, client_name")
      .single();

    if (error || !contract) {
      return NextResponse.json(
        { error: error?.message || "No se pudo crear el contrato" },
        { status: 500 },
      );
    }

    await admin
      .from("proposals")
      .update({ status: "accepted" } as any)
      .eq("id", payload.proposal_id)
      .eq("workspace_id", workspaceId);

    await admin.from("workspace_activity_events").insert({
      actor_user_id: user.id,
      workspace_id: workspaceId,
      entity_type: "contract",
      event_type: "contract.created",
      entity_id: contract.id,
      title: "Contract creado",
      description: `${payload.project_name} para ${contract.client_name}`,
      metadata: {
        contractId: contract.id,
        proposalId: contract.proposal_id,
      },
    } as any);

    return NextResponse.json(contract);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
