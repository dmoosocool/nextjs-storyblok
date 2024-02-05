import React from "react";

export const Blockquote = ({ children }: React.PropsWithChildren) => {
  return (
    <blockquote className="flex flex-col justify-center gap-y-[10px] px-[18px] py-[12px] text-[16px] font-light leading-[1.8] tracking-normal lg:px-[24px] lg:py-[18px] lg:text-[18px]">
      <div className="text-[40px] font-light leading-[28px]">“</div>
      {children}
    </blockquote>
  );
};
