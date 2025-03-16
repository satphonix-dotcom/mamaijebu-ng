
import React from "react";
import { Link } from "react-router-dom";

export const BrandLogo: React.FC = () => {
  return (
    <Link to="/" className="hidden md:block">
      <div className="flex items-center space-x-2">
        <span className="font-bold text-xl">LottoStats</span>
      </div>
    </Link>
  );
};
