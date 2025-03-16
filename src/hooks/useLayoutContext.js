import { useContext } from "react";
import { LayoutContext } from "@/contexts/LayoutContext";

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  return context;
}
