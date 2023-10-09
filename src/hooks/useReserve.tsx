import { useContractRead } from "wagmi";
import { FACTORY, USDC, WMATIC } from "../App";
import { PAIR_ABI } from "../abi/pair";
import { FACTORY_ABI } from "../abi/factory";

export default function useReserve(
  isMatic: boolean,
  token0: `0x${string}`,
  token1: `0x${string}`
): {
  reserveIn: bigint;
  reserveOut: bigint;
} {
  const { data: pair } = useContractRead({
    address: FACTORY,
    abi: FACTORY_ABI,
    functionName: "getPair",
    args: [token0.toLowerCase(), token1.toLowerCase()],
  });

  const { data: reserve } = useContractRead({
    address: pair! as `0xstring`,
    abi: PAIR_ABI,
    functionName: "getReserves",
  });

  const { reserveIn, reserveOut } =
    reserve !== undefined
      ? isMatic === true && WMATIC < USDC
        ? {
            reserveIn: (reserve as bigint[])![0],
            reserveOut: (reserve as bigint[])![1],
          }
        : {
            reserveIn: (reserve as bigint[])![1],
            reserveOut: (reserve as bigint[])![0],
          }
      : { reserveIn: 0n, reserveOut: 0n };

  return { reserveIn, reserveOut };
}
