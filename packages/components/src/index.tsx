import React from "react";
import { render } from "react-dom";

import { CourierProvider } from "@trycourier/react-provider";
import { CourierComponents } from "./components";

declare global {
  interface Window {
    courier: {
      __actions: {
        [action: string]: Array<() => void>;
      };
      toast?: {
        add: (message: { title: string; body: string }) => void;
      };
      inbox?: {
        config: any;
      };
      transport?: any;
      init: (config: ICourierConfig) => void;
      on: (action: string, cb: () => void) => void;
    };
    courierAsyncInit?: () => void | Array<() => void>;
    courierConfig: ICourierConfig;
  }
}
interface ICourierConfig {
  initOnLoad?: boolean;
  apiUrl?: string;
  clientKey: string;
  userId?: string;
  userSignature?: string;
  wsUrl?: string;
  components?: {
    inbox?: any;
    toast?: any;
  };
}

let hasInit = false;

const initCourier = async (courierConfig?: ICourierConfig) => {
  const { clientKey, apiUrl, userId, userSignature, wsUrl } =
    courierConfig ?? window.courierConfig ?? {};

  if (hasInit || typeof document === "undefined") {
    return;
  }

  if (!userId || !clientKey) {
    return;
  }

  const courierRoot = document.createElement("courier-root");
  document.body.appendChild(courierRoot);

  render(
    <CourierProvider
      apiUrl={apiUrl}
      clientKey={clientKey}
      userId={userId}
      userSignature={userSignature}
      wsUrl={wsUrl}
    >
      <CourierComponents />
    </CourierProvider>,
    courierRoot
  );

  hasInit = true;
};

window.courier = {
  __actions: {},
  init: initCourier,
  on: (action: string, cb: () => void) => {
    window.courier.__actions[action] = window.courier.__actions[action] ?? [];
    window.courier.__actions[action].push(cb);
  },
};

if (window.courierConfig?.initOnLoad !== false) {
  initCourier();
}

if (typeof window.courierAsyncInit === "function") {
  window.courierAsyncInit();
}

if (Array.isArray(window.courierAsyncInit)) {
  for (const init of window.courierAsyncInit) {
    init();
  }

  window.courierAsyncInit = undefined;
}
