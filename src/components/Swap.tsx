import { ChangeEvent, useState } from "react";

import { USDC, WMATIC } from "../App";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { BiSolidHandDown } from "react-icons/bi";
import { MdSwapVert } from "react-icons/md";
import useReserve from "../hooks/useReserve";
import useSwapWithETH from "../hooks/useSwapWithETH";
/** Calculate Amount Out function */
const getAmountOut = (
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint
) => {
  const numerator = 1000n * reserveIn * reserveOut;

  const denominator = 1000n * reserveIn + 997n * amountIn;

  return reserveOut - numerator / denominator;
};
const roundToSixDecimalPlaces = (numString: string) => {
  const num = Number(numString);
  return Math.round(num * 1e6) / 1e6;
};
export default function Swap() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [outputMinimum, setOutputMinimum] = useState<string>("");
  const [slippage, setSlippage] = useState<bigint>(1n);

  const [isMatic, setIsMatic] = useState<boolean>(true);

  const { reserveIn, reserveOut } = useReserve(isMatic, USDC, WMATIC);

  //* Custom Hook for Signing*/
  const {
    isApproveLoading,

    approve,
    approveNeed,
    isLoadingSwapExactETHForTokens,

    swapExactETHForTokens,
    isLoadingSwapExactTokensForETH,

    swapExactTokensForETH,
  } = useSwapWithETH(
    input,
    outputMinimum,
    isMatic, // true -> swapExactETHForTokens, MATIC -> USDC, false -> swapExactTokensForETH,  USDC -> MATIC
    USDC,
    6
  ); // FOR: swapExactETHForTokens, // USDC -> MATIC

  const handleInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    handleOutput(value);
  };
  const handleOutput = (value: string, isToggle?: boolean) => {
    const newIsMatic = isToggle === undefined ? isMatic : !isMatic;
    const amountIn = newIsMatic ? parseEther(value) : parseUnits(value, 6);
    const amountOut =
      newIsMatic === isMatic
        ? getAmountOut(amountIn, reserveIn, reserveOut)
        : getAmountOut(amountIn, reserveOut, reserveIn);
    if (newIsMatic) {
      setOutput(formatUnits(amountOut, 6));
    } else {
      setOutput(formatEther(amountOut));
    }
    const newSlippage = slippage === 0n ? 1n : slippage;
    setOutputMinimum(
      newIsMatic
        ? formatUnits(amountOut - (amountOut * newSlippage) / 100n, 6)
        : formatEther(amountOut - (amountOut * newSlippage) / 100n)
    );
  };
  const handleToggle = () => {
    setIsMatic(!isMatic);
    handleOutput(input, true);
  };
  return (
    <div className="flex flex-col items-center  p-4">
      <div className="flex flex-row w-full items-end">
        <MdSwapVert
          className="w-8 h-8 hover:text-yellow-500 cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out ml-auto"
          onClick={handleToggle}
        />
      </div>
      {isMatic ? (
        <div className="flex flex-col  justify-center items-center mt-4">
          <div className="flex flex-row items-center space-x-4 mt-4 w-80 border-4 border-black p-2">
            <img
              className="w-12 h-12"
              src="../../icon/matic_logo.png"
              alt="MATIC"
            />
            <input
              type="number"
              placeholder="MATIC Amount"
              onChange={handleInput}
              value={input}
              className="border-2 rounded p-2 w-40"
            />
          </div>

          <BiSolidHandDown className="w-12 h-12 mt-4 hover:text-yellow-500 cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out" />

          <div className="flex flex-row items-center space-x-4 mt-4 w-80 border-4 border-black p-2">
            <img
              className="w-12 h-12"
              src="../../icon/usdc_logo.png"
              alt="USDC"
            />
            <div className="border-2 rounded p-2 w-40">
              {roundToSixDecimalPlaces(output)}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col  justify-center items-center mt-4 ">
          <div className="flex flex-row items-center space-x-4 mt-4 w-80 border-4 border-black p-2">
            <img
              className="w-12 h-12"
              src="../../icon/usdc_logo.png"
              alt="USDC"
            />
            <input
              type="number"
              placeholder="USDC Amount"
              onChange={handleInput}
              value={input}
              className="border-2 rounded p-2 w-40"
            />
          </div>
          <BiSolidHandDown className="w-12 h-12 mt-4 hover:text-yellow-500 cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out" />
          <div className="flex flex-row items-center space-x-4 mt-4 w-80 border-4 border-black p-2">
            <img
              className="w-12 h-12"
              src="../../icon/matic_logo.png"
              alt="MATIC"
            />
            <div className="border-2 rounded p-2 w-40">
              {roundToSixDecimalPlaces(output)}
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 w-160">
        {isMatic ? (
          <button
            className="flex flex-row items-center space-x-2 text-white bg-black font-mono rounded p-2  hover:text-black hover:bg-yellow-300 hover:scale-125 transition-transform duration-300 ease-in-out"
            onClick={() => swapExactETHForTokens()}
          >
            Swap
            {isLoadingSwapExactETHForTokens && <div className="ml-2">...</div>}
          </button>
        ) : approveNeed ? (
          <button
            className="flex flex-row items-center space-x-2 font-mono text-white bg-black rounded p-2  hover:text-black hover:bg-yellow-300 hover:scale-125 transition-transform duration-300 ease-in-out"
            onClick={() => {
              approve();
            }}
          >
            Approve
            {isApproveLoading && <div className="ml-2">...</div>}
          </button>
        ) : (
          <button
            className="flex flex-row items-center space-x-2 font-mono text-white bg-black rounded p-2  hover:text-black hover:bg-yellow-300"
            onClick={() => {
              swapExactTokensForETH();
            }}
          >
            Swap
            {isLoadingSwapExactTokensForETH && <div className="ml-2">...</div>}
          </button>
        )}
      </div>
      <div className="flex flex-col items-center mt-4">
        <div className="text-lg font-mono">
          <div>
            슬리피지 해도 최소한 이정도는 보장해줄게:{" "}
            {roundToSixDecimalPlaces(outputMinimum)}
          </div>
          <div className="flex flex-row justify-center space-x-4 mt-2 align-center">
            <div>슬리피지 설정 해봐😛</div>
            <div>
              <input
                type="number"
                onChange={(event) => {
                  if (Number(event.target.value) >= 10) {
                    setSlippage(10n);
                  } else {
                    setSlippage(BigInt(event.target.value));
                  }
                }}
                value={slippage.toString()}
                className="border rounded w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
