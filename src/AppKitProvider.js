import { createAppKit, useAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
// import { arbitrum, mainnet } from "@reown/appkit/networks";
import { bscTestnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const queryClient = new QueryClient();

const projectId = process.env.REACT_APP_PROJECT_ID;

// console.log("🚀 REACT_APP_PROJECT_ID:", projectId); // this should NOT be undefined

const metadata = {
  name: "AppKit Example",
  description: "Testing WalletKit",
  url: "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// const networks = [mainnet, arbitrum];
const networks = [bscTestnet];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    email: false,
    socials: [],
    analytics: false,
  },
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
