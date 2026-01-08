import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: 'https://enabling-oryx-95.clerk.accounts.dev',
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;