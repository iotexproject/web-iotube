import wildcard from "@wildcard-api/server";
import { AuthAPI } from "./auth.endpoints";
import { _ } from "../../../common/utils/lodash";
import { Request } from "express";

export type WildcardContext = {
  req: Request;
};

const endpoints = {
  hello,
  ...AuthAPI,
};

Object.assign(wildcard.endpoints, endpoints);

export type Endpoints = typeof endpoints;

async function hello() {
  return "Hello World!";
}
