import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import ConnectButton from "./components/ConnectButton";

// 1. Get projectId
const projectId = "0b246600617a2d21e8f6ff104f2c131c";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [polygon];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

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
