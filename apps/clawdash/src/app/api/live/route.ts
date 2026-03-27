import { getGatewayUrl } from "@/lib/openclaw";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  const gatewayUrl = getGatewayUrl();

  const stream = new ReadableStream({
    start(controller) {
      let ws: WebSocket | null = null;
      let closed = false;

      function sendSSE(event: string, data: unknown) {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          cleanup();
        }
      }

      function connect() {
        try {
          ws = new WebSocket(gatewayUrl);

          ws.onopen = () => {
            sendSSE("connected", { gateway: gatewayUrl, timestamp: new Date().toISOString() });
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(String(event.data));
              sendSSE("message", data);
            } catch {
              sendSSE("message", { raw: String(event.data) });
            }
          };

          ws.onerror = () => {
            sendSSE("error", { message: "Gateway connection error" });
          };

          ws.onclose = () => {
            if (!closed) {
              sendSSE("disconnected", { timestamp: new Date().toISOString() });
              setTimeout(connect, 5000);
            }
          };
        } catch {
          sendSSE("error", { message: "Cannot connect to gateway", gateway: gatewayUrl });
          if (!closed) {
            setTimeout(connect, 5000);
          }
        }
      }

      function cleanup() {
        closed = true;
        if (ws) {
          try { ws.close(); } catch { /* ignore */ }
        }
        try { controller.close(); } catch { /* ignore */ }
      }

      sendSSE("init", {
        gateway: gatewayUrl,
        timestamp: new Date().toISOString(),
      });

      connect();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
