import React from "react";

export function Table(props: React.PropsWithChildren) {
  return (
    <div className="px-5">
      <div className="">
        <table className="box-content w-full" {...props} />
      </div>
    </div>
  );
}
