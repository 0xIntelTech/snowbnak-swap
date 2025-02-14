import React from "react";
import { WalletConnect } from "components/UI/ConnectButton";

export default function Header() {

  return (
    <div className="w-full top-0 fixed left-1/2 -translate-x-1/2 px-3 z-50 duration-200">
      <div className="container mx-auto relative py-4 max-w-[900px]">
        <div className="flex justify-between">
          <div className="logo relative flex">
            <a
              href="/"
              className="absolute -top-1 left-0 h-[65px] w-[72px] hidden sm:inline-block"
            >
              <img src="/logo.png" className="h-[70px] w-[75px]" alt="" />
            </a>
          </div>
          <p className="text-3xl my-auto">Swap Page</p>
          <div className="nav_action">
            <WalletConnect />
          </div>
        </div>
      </div>
    </div>
  );
}
