import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import ConnectButton from "./components/ConnectButton";
import Swap from "./components/Swap";
import AddLiquidity from "./components/AddLiquidity";
import WithdrawLiquidity from "./components/WithdrawLiquidity";
export const ROUTER02 = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
export const FACTORY = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";
export const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
export const WMATIC = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
// 1. Get projectId
const projectId = "501269758a220a5479dec5ff5ecfdcf6"; //TODO:Project ID 넣어주세요
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
