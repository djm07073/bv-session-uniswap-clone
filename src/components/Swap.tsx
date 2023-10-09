import { ChangeEvent, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { USDC, WMATIC } from "../App";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { AiOutlineDoubleRight } from "react-icons/ai";
import useReserve from "../hooks/useReserve";
import useSwapWithETH from "../hooks/useSwapWithETH";
export default function Swap() {
  const { isDisconnected } = useAccount();
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [outputMinimum, setOutputMinimum] = useState<string>("");
  const [slippage, setSlippage] = useState<bigint>(1n);
  const [usdcAmount, setUsdcAmount] = useState<bigint>(0n);
  const [isMatic, setIsMatic] = useState<boolean>(true);

  const { reserveIn, reserveOut } = useReserve(isMatic, USDC, WMATIC);
  const { data: usdcData } = useBalance({
    address: USDC,
  });
  //* Custom Hook for Signing*/
  const {
    isApproveLoading,
    isApproveSuccessing,
    approve,
    approveNeed,
    isLoadingSwapExactETHForTokens,
    isSuccessSwapExactETHForTokens,
    swapExactETHForTokens,
    isLoadingSwapExactTokensForETH,
    isSuccessSwapExactTokensForETH,
    swapExactTokensForETH,
  } = useSwapWithETH(
    input,
    outputMinimum,
    isMatic, // true -> swapExactETHForTokens, MATIC -> USDC, false -> swapExactTokensForETH,  USDC -> MATIC
    USDC,
    6
  ); // FOR: swapExactETHForTokens, // USDC -> MATIC

  /** Calculate Amount Out function */
  const getAmountOut = async (
    amountIn: bigint,
    reserveIn: bigint,
    reserveOut: bigint
  ) => {
    const numerator = 1000n * reserveIn * reserveOut;

    const denominator = 1000n * reserveIn + 997n * amountIn;

    return reserveOut - numerator / denominator;
  };
  /** Get USDC amount  */
  useEffect(() => {
    if (usdcData!.value) {
      setUsdcAmount(usdcData!.value);
    }
  }, [usdcData]);

  const handleInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    const input = isMatic ? parseEther(value) : parseUnits(value, 6);
    const amountOut = await getAmountOut(input, reserveIn, reserveOut);
    if (isMatic) {
      setOutput(formatUnits(amountOut, 6));
    } else {
      setOutput(formatEther(amountOut));
    }
    setOutputMinimum(
      isMatic
        ? formatUnits(amountOut - (amountOut * slippage) / 100n, 6)
        : formatEther(amountOut - (amountOut * slippage) / 100n)
    );
  };

  return (
    <div>
      {/* MATIC 양 입력 , 받게 될 USDC 계산됨*/}
      {!isDisconnected ? (
        <div>
          <div>USDC: {usdcAmount.toString()}</div>
        </div>
      ) : (
        <div className="text-1xl font-sans">좋은 말로 할때 지갑연결해라</div>
      )}
      <button
        onClick={() => {
          setIsMatic(!isMatic);
        }}
      >
        스왑 다른 걸로 하쉴?
      </button>
      {isMatic ? (
        <div className="flex flex-row align-middle space-x-4">
          <img className="w-12 h-12" src="../../icon/matic_logo.png" />
          <AiOutlineDoubleRight className="w-12 h-12" />
          <img className="w-12 h-12" src="../../icon/usdc_logo.png" />
        </div>
      ) : (
        <div className="flex flex-row align-middle space-x-4">
          <img className="w-12 h-12" src="../../icon/usdc_logo.png" />
          <AiOutlineDoubleRight className="w-12 h-12" />
          <img className="w-12 h-12" src="../../icon/matic_logo.png" />
        </div>
      )}
      <div>
        <input
          type="number"
          placeholder={isMatic ? "MATIC Amount" : "USDC Amount"}
          onChange={handleInput}
          value={input}
        />
        <div className="flex flex-col space-x-5">
          <div className="text-2xl font-sans">
            0.3% 수수료 빼고 너 이정도 받을듯?
          </div>

          <div className="text-2xl font-sans">Output: {output}</div>
          <div className="text-2xl font-sans">
            Output Minimum: {outputMinimum}
          </div>
          <div className="flex flex-row space-x-4">
            <div>슬리피지 설정 해봐😛 기본적으로 1%로 설정되어있어</div>
            <input
              type="number"
              placeholder="slippage <= 10%"
              onChange={(event) => {
                if (Number(event.target.value) >= 10) {
                  setSlippage(10n);
                } else {
                  setSlippage(BigInt(event.target.value));
                }
              }}
              value={slippage.toString()}
            />
          </div>
        </div>
      </div>
      {/* Swap*/}
      <div>
        {isMatic ? (
          <button onClick={() => swapExactETHForTokens()}>
            Swap
            {isLoadingSwapExactETHForTokens ? <div>...</div> : <div></div>}
            {isSuccessSwapExactETHForTokens ? <div>성공!</div> : <div></div>}
          </button>
        ) : approveNeed ? (
          <button
            onClick={() => {
              approve();
            }}
          >
            Approve{isApproveLoading ? <div>...</div> : <div></div>}
            {isApproveSuccessing ? <div>성공!</div> : <div></div>}
          </button>
        ) : (
          <button
            onClick={() => {
              swapExactTokensForETH();
            }}
          >
            Swap{isLoadingSwapExactTokensForETH ? <div>...</div> : <div></div>}
            {isSuccessSwapExactTokensForETH ? <div>성공!</div> : <div></div>}
          </button>
        )}

        {/* swapExactTokensForETH, // USDC -> MATIC */}
        {/* swapETHForExactTokens, // MATIC -> USDC */}
      </div>
    </div>
  );
}
