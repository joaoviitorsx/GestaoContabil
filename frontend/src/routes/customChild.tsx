import React from "react";
import { useNavigate } from "react-router-dom";
import type { CustomChildrenProps } from "../types/routes/customChild";

const CustomChild: React.FC<CustomChildrenProps> = ({Child}) => {
  const navigate = useNavigate();
  return (
    <Child navigate={navigate} />
  );
};

export default CustomChild;