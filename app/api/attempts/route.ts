import { createStudentContext } from "@/lib/supabase-server";
import { questionBank } from "@/app/data/questions";

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const context = await createStudentContext(request);
  if (!context) return json({ error: "Entre com e-mail para salvar o resultado." }, 401);
  let body: { answers?: unknown };
  try { body = await request.json(); } catch { return json({ error: "Respostas inválidas." }, 400); }
  if (!Array.isArray(body.answers) || body.answers.length !== 15) return json({ error: "O simulado precisa conter 15 respostas." }, 400);
  const checked = (body.answers as Array<{ id?: unknown; selected?: unknown }>).map((answer) => {
    const question = questionBank.find((item) => item.id === answer.id);
    if (!question || !Number.isInteger(answer.selected) || Number(answer.selected) < 0 || Number(answer.selected) > 3) return null;
    return { id: question.id, topic: question.topic, selected: Number(answer.selected), correct: Number(answer.selected) === question.answer };
  });
  if (checked.some((answer) => answer === null) || new Set(checked.map((answer) => answer?.id)).size !== 15) return json({ error: "O simulado contém respostas inválidas ou repetidas." }, 400);
  const answers = checked as Array<{ id: string; topic: string; selected: number; correct: boolean }>;
  const score = answers.filter((answer) => answer.correct).length;
  const { data, error } = await context.client.rpc("save_enade_attempt", {
    p_answers: answers,
    p_attempt_id: crypto.randomUUID(),
    p_score: score,
    p_created_at: new Date().toISOString(),
  });
  if (error) return json({ error: "Não foi possível salvar o resultado agora." }, 503);
  return json({ saved: true, attemptId: data, score, total: 15, answers });
}
