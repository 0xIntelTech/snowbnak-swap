import React, { useState } from "react";
import { fromReadableAmount, getAllowance } from "utils";
import { useAccount } from "wagmi";
import { useEthersProvider, useEthersSigner } from "hooks/useEthers";
import { zapList } from "config/farms";
import { getZapAddress } from "utils/addressHelpers";
import { getErc20Contract, getLpContract } from "utils/contractHelpers";
import { didUserReject, toReadableAmount } from "utils/customHelpers";
import { ethers } from "ethers";
import { notify } from "utils/toastHelper";
import TokenSelectModal from "components/TokenSelectModal";
import TokenSelect from "components/TokenSelect";
import Loading from "components/Loading";
import LogoLoading from "components/LogoLoading";
import useZap from "hooks/useZap";
import { MdOutlineSwapCalls } from "react-icons/md";
import { NATIVE_COIN_SYMBOL } from "config";

export default function Swap() {
  const signer = useEthersSigner();
  const { address } = useAccount();
  const provider = useEthersProvider();
  const [status, setStatus] = useState({
    insufficientA: false,
    insufficientB: false,
    tokenA: false,
    tokenB: false,
    loading: false,
    swap: false,
    approve: false,
  });

  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [tokenA, setTokenA] = useState(zapList[1]);
  const [tokenB, setTokenB] = useState(zapList[3]);
  const [tokenAAllowance, setTokenAAllowance] = useState(0);
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);
  const { onZap } = useZap();
  const zapAddress = getZapAddress();
  const [isApproving, setIsApproving] = useState(false);
  const [updateBalance, setUpdateBalance] = useState(false);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false);
  const [tokenPriceA, setTokenPriceA] = useState(false);
  const [tokenPriceB, setTokenPriceB] = useState(false);

  const closeModalA = () => {
    setOpenA(false);
  };

  const closeModalB = () => {
    setOpenB(false);
  };

  const handleSetInsufficientA = (flag) => {
    setStatus({ ...status, insufficientA: flag });
  };

  const handleSetInsufficientB = (flag) => {
    setStatus({ ...status, insufficientB: flag });
  };

  const handleSetTokenAAvailable = (flag) => {
    setStatus({ ...status, tokenA: flag });
  };

  const handleSetTokenBAvailable = (flag) => {
    setStatus({ ...status, tokenB: flag });
  };

  const handleReverse = () => {
    const tempTokenA = tokenA;
    setTokenA(tokenB);
    setTokenB(tempTokenA);
    setTokenAAmount(tokenBAmount);
    setTokenBAmount(0);
    checkAllowance(tokenB, "A");
  };

  const handleSetTokenA = (val) => {
    setTokenA(val);
    checkAllowance(val, "A");
  };

  const handleSetTokenB = (val) => {
    setTokenB(val);
  };

  const checkAllowance = async (token, type) => {
    if (token.lpSymbol !== NATIVE_COIN_SYMBOL) {
      setIsCheckingAllowance(true);
      const res = await getAllowance(address, token, zapAddress, provider);
      if (type === "A") {
        setTokenAAllowance(res);
      }
      setIsCheckingAllowance(false);
    } else {
      setStatus({ ...status, insufficientA: true });
    }
  };

  async function handleApprove() {
    if (Number(tokenAAmount) <= 0) {
      notify("error", "Please input the amount.");
      return;
    }

    try {
      if (Number(tokenAAllowance) < Number(tokenAAmount)) {
        console.log("approving...");
        setIsApproving(true);
        let tokenContract;
        if (tokenA.isTokenOnly) {
          tokenContract = getErc20Contract(tokenA.lpAddresses, signer);
        } else {
          tokenContract = getLpContract(tokenA.lpAddresses, signer);
        }
        const tx = await tokenContract.approve(
          zapAddress,
          ethers.constants.MaxUint256,
          { from: address }
        );
        await tx.wait();
        setIsApproving(false);
        checkAllowance(tokenA, "A");
      }
    } catch (e) {
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      } else {
        notify("error", e.reason);
      }
      setIsApproving(false);
    }
  }

  async function handleDeposit() {
    if (tokenA === tokenB || !tokenAAmount) return;
    try {
      setPendingTx(true);
      await onZap(
        tokenA.lpAddresses,
        tokenA.lpSymbol === NATIVE_COIN_SYMBOL ? true : false,
        fromReadableAmount(Number(tokenAAmount)),
        tokenB.lpAddresses,
        tokenB.lpSymbol === NATIVE_COIN_SYMBOL ? true : false
      );
      refreshData();
      setPendingTx(false);
    } catch (e) {
      console.log(e);
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      } else {
        notify("error", e.reason);
      }
      setPendingTx(false);
    }
  }

  const refreshData = () => {
    setPendingRefresh(true);
    setTokenAAmount("");
    setUpdateBalance(true);
    checkAllowance(tokenA, "A");
    setTimeout(() => {
      setPendingRefresh(false);
    }, 500);
  };

  const getTokenPrice = async (token) => {
    if (token.symbol === "DAI") return 1;
    try {
      const returned = await (
        await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${token.lpAddresses}`
        )
      ).json();

      if (returned && returned.pairs) {
        const correctPair = returned.pairs.filter(
          (pair) => pair.chainId === "pulsechain" && pair.dexId === "pulsex"
        );
        return correctPair[0]?.priceUsd;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getLpTokenPrice = async (token) => {
    try {
      const lpContract = getLpContract(tokenA.lpAddresses, provider);
      const lpBalance = await lpContract.totalSupply();
      const totalSupply = toReadableAmount(lpBalance, 18, 4);
      const returned = await (
        await fetch(
          `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${token.lpAddresses}`
        )
      ).json();

      if (returned && returned.pairs) {
        const correctPair = returned.pairs[0];
        const lpPrice = Number(
          Number(correctPair?.marketCap) / Number(totalSupply)
        ).toFixed(5);
        return lpPrice;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const estimateOutput = async (type, amount) => {
    if (type === "A") {
      setIsLoadingB(true);
    } else {
      setIsLoadingA(true);
    }
    let tokenAPrice;
    let tokenBPrice;
    let estimated;
    if (tokenA.isTokenOnly) {
      tokenAPrice = await getTokenPrice(tokenA);
    } else {
      tokenAPrice = await getLpTokenPrice(tokenA);
    }
    if (tokenB.isTokenOnly) {
      tokenBPrice = await getTokenPrice(tokenB);
    } else {
      tokenBPrice = await getLpTokenPrice(tokenB);
    }

    if (type === "A") {
      estimated = Number((amount * tokenAPrice) / tokenBPrice).toFixed(2);
      setTokenPriceA(tokenAPrice);
      setTokenPriceB(tokenBPrice);
      setTokenBAmount(estimated);
      setIsLoadingB(false);
    } else {
      estimated = Number((amount * tokenBPrice) / tokenAPrice).toFixed(2);
      setTokenPriceA(tokenAPrice);
      setTokenPriceB(tokenBPrice);
      setTokenAAmount(estimated);
      setIsLoadingA(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="snow_effect p-6">
        <div className="flex justify-between items-center">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center items-center">
            <div className="block">
              <h1 className="text-center text-2xl font-semibold">Zapper</h1>
            </div>
          </div>
          <div className="flex-1 flex justify-end items-center">
            <button
              className="bg-primary/20 rounded-full p-2 shadow-md hover:bg-primary/40 transition ease-in-out"
              onClick={refreshData}
            >
              <img
                src="/assets/refresh.png"
                alt=""
                className={`${pendingRefresh && "animate-spin"}`}
              />
            </button>
          </div>
        </div>
        <p className="text-center text-gray-400 py-3">
          Swap Anything to Anything
        </p>
        <div className="block">
          <TokenSelect
            type="A"
            token={tokenA}
            selectOnly={false}
            amount={tokenAAmount}
            setOpen={setOpenA}
            setAmount={setTokenAAmount}
            setStates={handleSetTokenAAvailable}
            setInsufficient={handleSetInsufficientA}
            updateBalance={updateBalance}
            insufficient={status?.insufficientA}
            estimateOutput={estimateOutput}
            isLoading={isLoadingA}
            tokenPrice={tokenPriceA}
          />

          <div className="flex justify-center items-center h-[26px] relative">
            <div className="p-2 bg-[#457081] rounded-full scale-125 z-20 absolute">
              <button
                onClick={handleReverse}
                className="transition ease-in-out flex justify-center items-center bg-primary/30 rounded-full p-1"
              >
                <MdOutlineSwapCalls className="text-xl hover:rotate-180  duration-300" />
              </button>
            </div>
          </div>

          <TokenSelect
            type="B"
            selectOnly={true}
            token={tokenB}
            amount={tokenBAmount}
            setOpen={setOpenB}
            setAmount={setTokenBAmount}
            setStates={handleSetTokenBAvailable}
            setInsufficient={handleSetInsufficientB}
            updateBalance={updateBalance}
            insufficient={status?.insufficientB}
            estimateOutput={estimateOutput}
            isLoading={isLoadingB}
            tokenPrice={tokenPriceB}
          />
          {isCheckingAllowance ? (
            <button className="main_btn mt-8 hover:bg-symbolHover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg transition ease-in-out p-[8px] bg-secondary-700">
              <Loading size="2xl" />
            </button>
          ) : (tokenA.lpSymbol !== NATIVE_COIN_SYMBOL &&
              Number(tokenAAllowance) === 0) ||
            (tokenA.lpSymbol !== NATIVE_COIN_SYMBOL &&
              Number(tokenAAllowance) < Number(tokenAAmount)) ? (
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="main_btn mt-8 hover:bg-symbolHover disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg transition ease-in-out p-[8px] bg-secondary-700"
            >
              Approve
            </button>
          ) : (
            <button
              onClick={handleDeposit}
              disabled={
                (tokenA.lpSymbol !== NATIVE_COIN_SYMBOL &&
                  Number(tokenAAllowance) < Number(tokenAAmount)) ||
                status.insufficientA ||
                pendingTx ||
                isApproving
              }
              className="main_btn mt-8 hover:bg-symbolHover disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg transition ease-in-out p-[8px] bg-secondary-700"
            >
              {`Swap ${tokenA.lpSymbol} into ${tokenB.lpSymbol}`}
            </button>
          )}
        </div>
        {/* TokenA modal */}
        <TokenSelectModal
          open={openA}
          closeModal={closeModalA}
          setToken={handleSetTokenA}
          disabledToken={tokenB?.lpSymbol}
          tokens={zapList}
        />
        {/* TokenB modal */}
        <TokenSelectModal
          open={openB}
          closeModal={closeModalB}
          setToken={handleSetTokenB}
          disabledToken={tokenA?.lpSymbol}
          tokens={zapList}
        />
      </div>
      {pendingTx && <LogoLoading title="Zapping..." />}
      {isApproving && <LogoLoading title="Approving..." />}
    </div>
  );
}
