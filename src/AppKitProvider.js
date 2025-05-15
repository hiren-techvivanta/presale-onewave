import { createAppKit, useAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { arbitrum, bsc, mainnet } from "@reown/appkit/networks";
import { bscTestnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const queryClient = new QueryClient();

const projectId = process.env.REACT_APP_PROJECT_ID;

const metadata = {
  name: "wave",
  description: "",
  url: `${process.env.REACT_APP_PROJECT_URL}`,
  icons: [`${process.env.REACT_APP_PROJECT_ICON}`],
};

// const networks = [mainnet, arbitrum];
const networks = [bsc];

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

export const wagmiClient = wagmiAdapter.wagmiConfig;

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
