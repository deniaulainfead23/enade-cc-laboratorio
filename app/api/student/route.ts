import { createStudentContext } from "@/lib/supabase-server";

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  const context = await createStudentContext(request);
  if (!context) return json({ signedIn: false });
  const { client, user } = context;
  const fallbackName = String(user.user_metadata?.display_name ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Estudante");
  const now = new Date().toISOString();
  const { error: ensureError } = await client.from("students").upsert({ user_id: user.id, display_name: fallbackName, current_stage: "revisao", created_at: now, updated_at: now }, { onConflict: "user_id", ignoreDuplicates: true });
  if (ensureError) return json({ error: "Não foi possível preparar seu perfil." }, 503);
  const [profileResult, topicsResult, attemptsResult] = await Promise.all([
    client.from("students").select("display_name, github_url, current_stage").eq("user_id", user.id).single(),
    client.from("topic_progress").select("topic, attempted, correct").eq("user_id", user.id),
    client.from("quiz_attempts").select("score, total, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
  ]);
  if (profileResult.error || topicsResult.error || attemptsResult.error) return json({ error: "Não foi possível carregar seu perfil agora." }, 503);
  const profile = profileResult.data;
  return json({ signedIn: true, profile: { displayName: profile.display_name, githubUrl: profile.github_url, currentStage: profile.current_stage }, topics: topicsResult.data.map((row) => ({ topic: row.topic, attempted: row.attempted, correct: row.correct })), attempts: attemptsResult.data.map((row) => ({ score: row.score, total: row.total, createdAt: row.created_at })) });
}

export async function PATCH(request: Request) {
  const context = await createStudentContext(request);
  if (!context) return json({ error: "Entre com e-mail para salvar seu perfil." }, 401);
  let body: { displayName?: unknown; githubUrl?: unknown; currentStage?: unknown };
  try { body = await request.json(); } catch { return json({ error: "Dados inválidos." }, 400); }
  const { client, user } = context;
  const displayName = typeof body.displayName === "string" ? body.displayName.trim().slice(0, 60) : "";
  const githubUrl = typeof body.githubUrl === "string" ? body.githubUrl.trim() : "";
  const currentStage = ["inicio", "revisao", "concluinte"].includes(String(body.currentStage)) ? String(body.currentStage) : "revisao";
  if (!displayName) return json({ error: "Informe como seu nome deve aparecer." }, 400);
  if (githubUrl && !/^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(githubUrl)) return json({ error: "Informe o endereço público do seu perfil GitHub, como https://github.com/seu-usuario." }, 400);
  const { error } = await client.from("students").upsert({ user_id: user.id, display_name: displayName, github_url: githubUrl || null, current_stage: currentStage, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) return json({ error: "Não foi possível salvar o perfil agora." }, 503);
  return json({ saved: true, profile: { displayName, githubUrl: githubUrl || null, currentStage } });
}
