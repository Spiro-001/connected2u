"use client";

import { CookiesProvider } from "next-client-cookies";
import React from "react";

const ClientCookiesProvider: typeof CookiesProvider = (props) => {
  return <CookiesProvider {...props} />;
};

export default ClientCookiesProvider;
