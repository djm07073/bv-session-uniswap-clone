import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import dotenv from "dotenv";
import { WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import ConnectButton from "./components/ConnectButton";
dotenv.config();
const PID = process.env.PID!;
// 1. Get projectId
const projectId = PID;

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
