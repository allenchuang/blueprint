import { type NextRequest, NextResponse } from "next/server";
import {
  verifyCloudProof,
  type ISuccessResult,
  type IVerifyResponse,
} from "@worldcoin/minikit-js";

interface RequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as RequestPayload;
  const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`;

  const verifyRes = (await verifyCloudProof(
    payload,
    appId,
    action,
    signal
  )) as IVerifyResponse;

  if (verifyRes.success) {
    return NextResponse.json({ verifyRes, status: 200 });
  }

  return NextResponse.json({ verifyRes, status: 400 });
}
