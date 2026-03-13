import type { FastifyInstance } from "fastify";
import { WalletService } from "@repo/wallet";

export async function walletRoutes(app: FastifyInstance) {
  app.post(
    "/wallets",
    {
      schema: {
        description:
          "Generate a new main wallet with its associated agent wallet",
        tags: ["wallets"],
        body: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: { type: "string", format: "uuid" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              mainWallet: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  derivationPath: { type: "string" },
                  derivationIndex: { type: "number" },
                },
              },
              agentWallet: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  derivationPath: { type: "string" },
                  derivationIndex: { type: "number" },
                },
              },
              mnemonic: {
                type: "string",
                description:
                  "BIP-39 mnemonic. Must be stored securely by the client. Server does NOT persist this.",
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.body as { userId: string };

      const { mnemonic, mainWallet, mainAgentWallet } =
        WalletService.generateFullHierarchy();

      // TODO: persist wallet records to DB via @repo/db
      // const db = createDb(process.env.DATABASE_URL!);
      // await db.insert(wallets).values([...]);

      app.log.info(
        { userId, mainAddress: mainWallet.address },
        "Generated wallet hierarchy"
      );

      reply.status(201);
      return {
        mainWallet: {
          address: mainWallet.address,
          derivationPath: mainWallet.derivationPath,
          derivationIndex: mainWallet.derivationIndex,
        },
        agentWallet: {
          address: mainAgentWallet.address,
          derivationPath: mainAgentWallet.derivationPath,
          derivationIndex: mainAgentWallet.derivationIndex,
        },
        mnemonic,
      };
    }
  );

  app.post(
    "/wallets/subaccounts",
    {
      schema: {
        description:
          "Create a new subaccount and derive its agent wallet from the user's mnemonic",
        tags: ["wallets"],
        body: {
          type: "object",
          required: ["userId", "mnemonic", "label"],
          properties: {
            userId: { type: "string", format: "uuid" },
            mnemonic: { type: "string" },
            label: { type: "string" },
            subaccountIndex: {
              type: "number",
              description:
                "Derivation index for the subaccount. Must be >= 1. Auto-assigned if omitted.",
            },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              subaccount: {
                type: "object",
                properties: {
                  index: { type: "number" },
                  label: { type: "string" },
                },
              },
              agentWallet: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  derivationPath: { type: "string" },
                  derivationIndex: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { userId, mnemonic, label, subaccountIndex } = request.body as {
        userId: string;
        mnemonic: string;
        label: string;
        subaccountIndex?: number;
      };

      // Default to index 1 if not provided; in production, query DB for next available index
      const index = subaccountIndex ?? 1;

      const { wallet: agentWallet } = WalletService.deriveAgentWallet(
        mnemonic,
        index
      );

      // TODO: persist subaccount + agent wallet to DB
      // const db = createDb(process.env.DATABASE_URL!);
      // await db.insert(subaccounts).values({ userId, label, derivationIndex: index });
      // await db.insert(wallets).values({ ... });

      app.log.info(
        { userId, label, agentAddress: agentWallet.address },
        "Created subaccount with agent wallet"
      );

      reply.status(201);
      return {
        subaccount: { index, label },
        agentWallet: {
          address: agentWallet.address,
          derivationPath: agentWallet.derivationPath,
          derivationIndex: agentWallet.derivationIndex,
        },
      };
    }
  );

  app.post(
    "/wallets/recover",
    {
      schema: {
        description: "Recover all wallets from a mnemonic",
        tags: ["wallets"],
        body: {
          type: "object",
          required: ["mnemonic"],
          properties: {
            mnemonic: { type: "string" },
            subaccountCount: {
              type: "number",
              description: "Number of subaccount agent wallets to re-derive",
              default: 0,
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              mainWallet: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  derivationPath: { type: "string" },
                },
              },
              mainAgentWallet: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  derivationPath: { type: "string" },
                },
              },
              subaccountAgentWallets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    address: { type: "string" },
                    derivationPath: { type: "string" },
                    derivationIndex: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request) => {
      const { mnemonic, subaccountCount } = request.body as {
        mnemonic: string;
        subaccountCount?: number;
      };

      const result = WalletService.recoverFromMnemonic(
        mnemonic,
        subaccountCount ?? 0
      );

      return {
        mainWallet: {
          address: result.mainWallet.address,
          derivationPath: result.mainWallet.derivationPath,
        },
        mainAgentWallet: {
          address: result.mainAgentWallet.address,
          derivationPath: result.mainAgentWallet.derivationPath,
        },
        subaccountAgentWallets: result.subaccountAgentWallets.map((w) => ({
          address: w.address,
          derivationPath: w.derivationPath,
          derivationIndex: w.derivationIndex,
        })),
      };
    }
  );
}
