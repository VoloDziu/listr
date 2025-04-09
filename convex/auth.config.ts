export default {
  providers: [
    {
      domain: process.env.EXPO_PUBLIC_CLERK_CONVEX_ISSUER!,
      applicationID: "convex",
    },
  ],
};
