import { type NextRequest, NextResponse } from "next/server";
import type { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";

interface RequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

export async function POST(req: NextRequest) {
  const { payload } = (await req.json()) as RequestPayload;

  const response = await fetch(
    `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.NEXT_PUBLIC_WORLD_APP_ID}&type=payment`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.WORLD_APP_DEV_PORTAL_API_KEY}`,
      },
    }
  );

  const transaction = await response.json();

  if (
    transaction.reference === payload.reference &&
    transaction.transaction_status !== "failed"
  ) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}
