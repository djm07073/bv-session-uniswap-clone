import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import ConnectButton from "./components/ConnectButton";
import Swap from "./components/Swap";
import AddLiquidity from "./components/AddLiquidity";
import WithdrawLiquidity from "./components/WithdrawLiquidity";

// 1. Get projectId
const projectId = "501269758a220a5479dec5ff5ecfdcf6";
// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "UniswapV2",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [polygon];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: polygon });

export default function App() {
  return (
    <div className="flex flex-col mt-5">
      <WagmiConfig config={wagmiConfig}>
        {/* 지갑연결하기 */}
        <h2 className="font-bold text-2xl"> 1. Wallet Connect</h2>
        <ConnectButton />
        {/* 스왑연동하기 */}
        <h2 className="font-bold text-2xl"> 2. Swap MATIC to USDC</h2>
        <Swap />
        {/* 유동성공급/출금하기 */}
        <h2 className="font-bold text-2xl">
          3. Add Liquidity on MATIC-USDC POOL
        </h2>
        <AddLiquidity />
        <h2 className="font-bold text-2xl">
          4. Withdraw Liquidity on MATIC-USDC POOL
        </h2>
        <WithdrawLiquidity />
      </WagmiConfig>
    </div>
  );
}
