import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";

export const Template = () => {
  const store = useLocalStore(() => ({
    count: 0,
    setCount(count) {
      this.count = count;
    },
  }));
  return useObserver(() => (
    <div>
      <div>Template: {store.count}</div>
      <button onClick={() => store.setCount(store.count + 1)}>+</button>
      <button onClick={() => store.setCount(store.count - 1)}>-</button>
    </div>
  ));
};
