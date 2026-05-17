import { BaseError, UserRejectedRequestError } from "viem";

export function friendlyError(error: unknown): string {
  if (error instanceof UserRejectedRequestError) {
    return "Transaction rejected in wallet.";
  }

  if (error instanceof BaseError) {
    const short = error.shortMessage.toLowerCase();
    if (short.includes("user rejected")) return "Transaction rejected in wallet.";
    if (short.includes("insufficient funds")) return "Insufficient native token balance for gas.";
    if (short.includes("insufficient balance")) return "Insufficient token balance.";
    if (short.includes("insufficient allowance")) return "Token approval is too low.";
    if (short.includes("chain mismatch") || short.includes("wrong network")) {
      return "Wrong network. Switch to Arbitrum Sepolia and try again.";
    }
    return error.shortMessage;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes("missing env")) return error.message;
    if (message.includes("failed to fetch")) return "Could not reach the subgraph endpoint.";
    return error.message || "Something went wrong.";
  }

  return "Something went wrong.";
}

export function missingEnvMessage(names: string[]): string {
  return names.length ? `Missing env values: ${names.join(", ")}` : "";
}
