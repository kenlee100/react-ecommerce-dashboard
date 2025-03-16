import { useState } from "react";
import PropTypes from "prop-types";
import { LayoutContext } from "@/contexts/LayoutContext";

LayoutProvider.propTypes = {
  children: PropTypes.node,
};
export function LayoutProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const contextValue = {
    isLoading,
    setIsLoading,
  };
  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}
