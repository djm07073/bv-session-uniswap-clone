import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { USDC } from "../App";

export default function MyUSDC() {
  const { isDisconnected } = useAccount();
  const [usdcAmount, setUsdcAmount] = useState<bigint>(0n);
  const { data: usdcData } = useBalance({
    address: USDC,
  });

  /** Get USDC amount  */
  useEffect(() => {
    if (usdcData!.value) {
      setUsdcAmount(usdcData!.value);
    }
  }, [usdcData]);

  return !isDisconnected ? (
    <div className="flex flex-row space-x-4 bg-white rounded p-2 text-black font-mono">
      <img className="w-6 h-6" src="../icon/usdc_logo.png" />
      <p>USDC:</p>
      <div className="w-6 h-6 text-black">{usdcAmount.toString()}</div>{" "}
    </div>
  ) : (
    <div className="text-1xl bg-white rounded p-2 text-black">
      좋은 말로 할때 지갑연결해라 🤬
    </div>
  );
}
