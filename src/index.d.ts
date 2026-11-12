export interface M2MAgentKitConfig {
  apiBase?: string;
  m2mPass?: string;
  xPayment?: string;
  maxPriceUsd?: number;
  autoPayBaseUsdc?: boolean;
  autoFreeTrial?: boolean;
  fetch?: typeof globalThis.fetch;
}

export interface AgentKitAction {
  name: string;
  description: string;
  schema: Record<string, any>;
  invoke: (args?: Record<string, any>) => Promise<string>;
}

export declare const API_BASE: string;
export declare const BASE_USDC_ADDRESS: string;
export declare const BASE_TREASURY_ADDRESS: string;
export declare const SOLANA_TREASURY_ADDRESS: string;
export declare const DEFAULT_MAX_PRICE_USD: number;
export declare const AGENTKIT_TOOLS: Array<Record<string, any>>;
export declare const TOOLS_BY_NAME: Record<string, Record<string, any>>;

export declare class M2MFreedomActionProvider {
  name: string;
  actionProviders: any[];
  apiBase: string;
  m2mPass: string | null;
  xPayment: string | null;
  maxPriceUsd: number;
  autoPayBaseUsdc: boolean;
  autoFreeTrial: boolean;
  constructor(config?: M2MAgentKitConfig);
  supportsNetwork(network?: any): boolean;
  invokeTool(toolName: string, args?: Record<string, any>, walletProvider?: any): Promise<Record<string, any>>;
  getActions(walletProvider?: any): AgentKitAction[];
}

export declare function m2mFreedomActionProvider(config?: M2MAgentKitConfig): M2MFreedomActionProvider;
export default m2mFreedomActionProvider;
