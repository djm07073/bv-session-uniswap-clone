import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import ConnectButton from "./components/ConnectButton";
import Swap from "./components/Swap";
import { alchemyProvider } from "wagmi/providers/alchemy";

import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";
import MyUSDC from "./components/MyUSDC";
export const ROUTER02 = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
export const FACTORY = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";
export const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
export const WMATIC = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
// 1. Get projectId
const projectId = import.meta.env.VITE_PID;
const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY;
// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "uniswapv2-clone",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const { chains, publicClient } = configureChains(
  [polygon],
  [alchemyProvider({ apiKey: ALCHEMY_KEY })]
);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: { projectId, showQrModal: false, metadata },
    }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
  ],
  publicClient,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: polygon,
});

export default function App() {
  return (
    <div className="flex flex-col mt-10 justify-center items-center">
      {" "}
      {/* 가운데 정렬 */}
      <h1 className="text-4xl font-mono">
        BlockchainValley Session: Uniswap-V2 Clone
      </h1>
      <WagmiConfig config={wagmiConfig}>
        {/* 지갑연결하기 */}
        <div className="my-4 border-b-2 border-solid border-gray-500 w-1/2"></div>{" "}
        {/* 과정 사이 가로선 */}
        <h2 className="font-bold font-mono text-2xl"> 1. Wallet Connect</h2>
        <ConnectButton />
        <MyUSDC />
        {/* MATIC 양 입력 , 받게 될 USDC 계산됨*/}
        <div className="my-4 border-b-2 border-solid border-gray-500 w-1/2"></div>{" "}
        {/* 과정 사이 가로선 */}
        {/* 스왑연동하기 */}
        <h2 className="font-bold font-mono text-2xl"> 2. Swap MATIC to USDC</h2>
        <Swap />
        {/* 유동성 공급/출금하기 */}
        <div className="my-4 border-b-2 border-solid border-gray-500 w-1/2"></div>{" "}
        {/* 과정 사이 가로선 */}
        <h2 className="font-bold font-mono text-2xl">
          3. Add Liquidity on MATIC-USDC POOL
        </h2>
        {/* <AddLiquidity /> */}
        <div className="my-4 border-b-2 border-solid border-gray-500 w-1/2"></div>{" "}
        {/* 과정 사이 가로선 */}
        <h2 className="font-bold font-mono text-2xl">
          4. Withdraw Liquidity on MATIC-USDC POOL
        </h2>
        {/* <WithdrawLiquidity /> */}
      </WagmiConfig>
    </div>
  );
}
