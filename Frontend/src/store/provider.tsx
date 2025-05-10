import { Provider } from "react-redux";
import { store } from "./store";
import type { JSX } from "react";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}
