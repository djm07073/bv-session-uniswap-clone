import { ChangeEvent, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { USDC, WMATIC } from "../App";
import { formatUnits, parseEther } from "viem";
import { AiOutlineDoubleRight } from "react-icons/ai";
import useReserve from "../hooks/useReserve";
export default function Swap() {
  const { isDisconnected } = useAccount();
  const [input, setInput] = useState<bigint>(0n);
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
    const amountInWithFee = amountIn * 997n;
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn * 1000n + amountInWithFee;
    return numerator / denominator;
  };
  useEffect(() => {
    if (usdcData!.value) {
      setUsdcAmount(usdcData!.value);
    }
  }, [usdcData]);

  const handleInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = parseEther(event.target.value);
    setInput(input);
    const amountOut = await getAmountOut(input, reserveIn, reserveOut);

    if (isMatic) {
      setOutput(formatUnits(amountOut, 6));
    } else {
      setOutput(formatUnits(amountOut, 18));
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
          placeholder="MATIC Amount"
          onChange={handleInput}
        />
        <div>{output}</div>
      </div>
      {/* Call SwapWith*/}
    </div>
  );
}
