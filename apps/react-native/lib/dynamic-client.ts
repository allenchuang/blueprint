import { createClient, type DynamicClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { appConfig } from "@repo/app-config";
import { dynamicEnabled, DYNAMIC_ENVIRONMENT_ID } from "./dynamic";

let _client: DynamicClient | null = null;

export function getDynamicClient(): DynamicClient {
  if (!_client) {
    _client = createClient({
      environmentId: DYNAMIC_ENVIRONMENT_ID,
      appName: appConfig.name,
    }).extend(ReactNativeExtension());
  }
  return _client;
}

export const dynamicClient = dynamicEnabled ? getDynamicClient() : (null as unknown as DynamicClient);
