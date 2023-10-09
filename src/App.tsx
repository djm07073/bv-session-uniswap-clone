import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import ConnectButton from "./components/ConnectButton";
import { publicProvider } from "wagmi/providers/public";
import { walletConnectProvider } from "@web3modal/wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
const PID = import.meta.env.VITE_PID;
// 1. Get projectId
const projectId = PID;

// 2. Create wagmiConfig
const { chains, publicClient } = configureChains(
  [polygon],
  [walletConnectProvider({ projectId }), publicProvider()]
);
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: { projectId, showQrModal: false, metadata },
    }),
  ],
  publicClient,
});

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: polygon });

export default function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      {/* 지갑연결하기 */}
      <ConnectButton />
      {/* 스왑연동하기 */}
      {/* 유동성공급/출금하기 */}
    </WagmiConfig>
  );
}
