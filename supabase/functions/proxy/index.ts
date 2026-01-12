const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Target-Url",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const targetUrl = req.headers.get("X-Target-Url");
    
    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: "Missing X-Target-Url header" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const proxyResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const contentType = proxyResponse.headers.get("content-type") || "text/html";
    const body = await proxyResponse.text();

    return new Response(body, {
      status: proxyResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});