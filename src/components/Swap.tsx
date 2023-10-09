import { ChangeEvent, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { USDC, WMATIC } from "../App";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { AiOutlineDoubleRight } from "react-icons/ai";
import useReserve from "../hooks/useReserve";
export default function Swap() {
  const { isDisconnected } = useAccount();
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [usdcAmount, setUsdcAmount] = useState<bigint>(0n);
  const [isMatic, setIsMatic] = useState<boolean>(true);
  const { reserveIn, reserveOut } = useReserve(isMatic, USDC, WMATIC);
  const { data: usdcData } = useBalance({
    address: USDC,
  });
  const getAmountOut = async (
    amountIn: bigint,
    reserveIn: bigint,
    reserveOut: bigint
  ) => {
    const numerator = 1000n * reserveIn * reserveOut;

    const denominator = 1000n * reserveIn + 997n * amountIn;

    return reserveOut - numerator / denominator;
  };

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
  };
  const handleDirection = () => {
    setIsMatic(!isMatic);
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
      <button onClick={handleDirection}>스왑 다른 걸로 하쉴?</button>
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
        <div>
          <div className="text-2xl font-sans">
            0.3% 수수료 빼고 너 이정도 받을듯?
          </div>

          <div>{output}</div>
        </div>
      </div>
      {/* Call SwapWith*/}
      {/* swapExactTokensForETH, // USDC -> MATIC */}
      {/* swapETHForExactTokens, // MATIC -> USDC */}
    </div>
  );
}
