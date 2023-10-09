import { maxUint256, parseEther, parseUnits } from "viem";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { ROUTER02, WMATIC } from "../App";
import { ROUTER_ABI } from "../abi/router02";
import { ERC20_ABI } from "../abi/erc20";

export default function useSwapWithETH(
  input: string,
  outputMinimum: string,
  isTokenInNative: boolean,
  tokenInOrOut: `0x${string}`,
  decimal: number
) {
  let approveNeed: boolean;
  const { address } = useAccount();
  const tokenIn = isTokenInNative ? tokenInOrOut : WMATIC;
  const tokenOut = isTokenInNative ? WMATIC : tokenInOrOut;
  const {
    isSuccess: isSuccessSwapExactETHForTokens,
    isLoading: isLoadingSwapExactETHForTokens,
    write: swapExactETHForTokens,
  } = useContractWrite({
    address: ROUTER02,
    abi: ROUTER_ABI,
    functionName: "swapExactETHForTokens",
    args: [
      parseUnits(outputMinimum, decimal),
      [tokenIn, tokenOut],
      address,
      maxUint256,
    ],
    value: parseEther(input),
  });

  const {
    isSuccess: isSuccessSwapExactTokensForETH,
    isLoading: isLoadingSwapExactTokensForETH,
    write: swapExactTokensForETH,
  } = useContractWrite({
    address: ROUTER02,
    abi: ROUTER_ABI,
    functionName: "swapExactETHForTokens",
    args: [
      parseUnits(outputMinimum, decimal),
      [tokenIn, tokenOut],
      address,
      maxUint256,
    ],
    value: parseEther(input),
  });

  const {
    isSuccess: isApproveSuccessing,
    isLoading: isApproveLoading,
    write: approve,
  } = useContractWrite({
    address: tokenInOrOut,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [ROUTER02, parseUnits(input, decimal)],
  });

  const { data: allowance } = useContractRead({
    address: tokenInOrOut,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, ROUTER02],
  });

  if ((allowance as unknown as bigint) >= parseUnits(input, decimal)) {
    approveNeed = false;
  } else {
    approveNeed = true;
  }

  return {
    isApproveLoading,
    isApproveSuccessing,
    approve,
    allowance,
    approveNeed,
    isLoadingSwapExactETHForTokens,
    isSuccessSwapExactETHForTokens,
    swapExactETHForTokens,
    isLoadingSwapExactTokensForETH,
    isSuccessSwapExactTokensForETH,
    swapExactTokensForETH,
  };
}
