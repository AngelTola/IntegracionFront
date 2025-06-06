import * as React from "react";
import { SVGProps } from "react";

const Categoria = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M80-160v-640h320l80 80h400v560H80Zm160-160h320v-80H240v80Zm0-160h480v-80H240v80Z" />
  </svg>
);

export default Categoria;
