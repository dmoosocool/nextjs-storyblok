import React from "react";
import Balancer from "react-wrap-balancer";

export function H1({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 {...props}>
      <Balancer>{children}</Balancer>
    </h1>
  );
}
