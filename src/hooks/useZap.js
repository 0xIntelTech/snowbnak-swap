import { useCallback } from "react";
import { zap, zapForFarm } from "utils/callHelpers";
import { useZapContract } from "./useContract";
import { useAccount } from "wagmi";
import { utils } from "ethers";

const useZap = () => {
  const { address } = useAccount();
  const zapContract = useZapContract();

  const handleZap = useCallback(
    async (tokenA, isNative, amount, tokenB, isNativeOut) => {
      await zap(
        zapContract,
        tokenA,
        isNative,
        amount,
        tokenB,
        isNativeOut,
        address
      );
    },
    [address, zapContract]
  );

  return { onZap: handleZap };
};

export const useZapForFarm = () => {
  const { address } = useAccount();
  const zapContract = useZapContract();

  const handleZap = useCallback(
    async (tokenA, isNative, amount, eoa, tokenB, pid) => {
      const isValidAddress = utils.isAddress(eoa);
      if (!isValidAddress) {
        const custom_urn = eoa;
        const promo_address = '0x0000000000000000000000000000000000000000';
        await zapForFarm(
          zapContract,
          tokenA,
          isNative,
          amount,
          custom_urn,
          promo_address,
          tokenB,
          pid,
          address
        );
      } else {
        const custom_urn = '';
        const promo_address = eoa;
        await zapForFarm(
          zapContract,
          tokenA,
          isNative,
          amount,
          custom_urn,
          promo_address,
          tokenB,
          pid,
          address
        );
      }
    },
    [address, zapContract]
  );

  return { onZapForFarm: handleZap };
};

export default useZap;
