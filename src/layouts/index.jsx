import React from "react";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <>
      {Array.from(Array(100).keys()).map((i) => (
        <div className="snow" key={i}></div>
      ))}
      <div className="w-full min-h-[calc(100vh)] py-[90px] relative px-1 font-cls">
        <Header />
        <div className="flex w-full h-full justify-center font-cls">
          {children}
        </div>
      </div>
    </>
  );
}
