export async function onRequest(context) {
  const { env } = context;
  try {
    const result = await env.BLOGS_DB.prepare(
      "SELECT * FROM locations LIMIT 5"
    ).all();
    return new Response(JSON.stringify(result, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}