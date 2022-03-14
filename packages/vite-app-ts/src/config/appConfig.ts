import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { TNetworkInfo, TEthersProvider } from 'eth-hooks/models';
import { ethers } from 'ethers';
import { invariant } from 'ts-invariant';

import { NETWORKS, TNetworkNames } from '../models/constants/networks';

import { joeFactory, joeRouter } from './contracts/joeRouter';

export const DEBUG = true;
invariant.log('MODE', import.meta.env.MODE, import.meta.env.DEV);
/** ******************************
 * TARGET NETWORK CONFIG: 📡 What chain are your contracts deployed to?
 ****************************** */

/**
 * This constant is your target network that the app is pointed at
 * 🤚🏽  Set your target frontend network <--- select your target frontend network(localhost, rinkeby, xdai, mainnet)
 */
const targetNetworkFTM: TNetworkNames = 'fantom';
const targetNetworkAVAX: TNetworkNames = 'avalanche';
const targetNetwork: TNetworkNames = 'avalanche' as TNetworkNames;
invariant.log('VITE_APP_TARGET_NETWORK', targetNetworkAVAX);
invariant(
  NETWORKS[targetNetworkFTM] != null || NETWORKS[targetNetworkAVAX] != null,
  `Invalid target network: ${targetNetworkFTM}`
);

export const TARGET_NETWORK_INFO: TNetworkInfo = NETWORKS[targetNetwork];
if (DEBUG) console.log(`📡 Connecting to ${TARGET_NETWORK_INFO.name}`);

/** ******************************
 * APP CONFIG:
 ****************************** */
/**
 * localhost faucet enabled
 */
export const FAUCET_ENABLED = import.meta.env.VITE_FAUCET_ALLOWED === 'true' && import.meta.env.DEV;
/**
 * Use burner wallet as fallback
 */
export const BURNER_FALLBACK_ENABLED = import.meta.env.VITE_BURNER_FALLBACK_ALLOWED === 'true' && import.meta.env.DEV;
/**
 * Connect to burner on first load if there are no cached providers
 */
export const CONNECT_TO_BURNER_AUTOMATICALLY =
  import.meta.env.VITE_CONNECT_TO_BURNER_AUTOMATICALLY === 'true' && import.meta.env.DEV;

if (DEBUG)
  invariant.log(
    `import.meta.env.DEV: ${import.meta.env.DEV}`,
    `import.meta.env.VITE_FAUCET_ALLOWED: ${import.meta.env.VITE_FAUCET_ALLOWED}`,
    `import.meta.env.VITE_BURNER_FALLBACK_ALLOWED: ${import.meta.env.VITE_BURNER_FALLBACK_ALLOWED}`,
    `import.meta.env.VITE_CONNECT_TO_BURNER_AUTOMATICALLY: ${import.meta.env.VITE_CONNECT_TO_BURNER_AUTOMATICALLY}`
  );

if (DEBUG)
  invariant.log(
    `FAUCET_ENABLED: ${FAUCET_ENABLED}`,
    `BURNER_FALLBACK_ENABLED: ${BURNER_FALLBACK_ENABLED}`,
    `CONNECT_TO_BURNER_AUTOMATICALLY: ${CONNECT_TO_BURNER_AUTOMATICALLY}`
  );

export const SUBGRAPH_URI = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract';

/** ******************************
 * OTHER FILES
 ****************************** */

/**
 * See web3ModalConfig.ts to setup your wallet connectors
 */

/**
 * See contractConnectorConfig.ts for your contract configuration
 */

/**
 * see apiKeysConfig.ts for your api keys
 */

/** ******************************
 * PROVIDERS CONFIG
 ****************************** */

// -------------------
// Connecting to mainnet
// -------------------
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const mainnetScaffoldEthProvider = new StaticJsonRpcProvider(import.meta.env.VITE_RPC_MAINNET);

// const mainnetProvider = new InfuraProvider("mainnet",import.meta.env.VITE_KEY_INFURA);

// 🚊 your mainnet provider
export const MAINNET_PROVIDER = mainnetScaffoldEthProvider;

// -------------------
// connecting to local provider
// -------------------

if (DEBUG) console.log('🏠 Connecting to provider:', NETWORKS.localhost.rpcUrl);
export const LOCAL_PROVIDER: TEthersProvider | undefined =
  TARGET_NETWORK_INFO === NETWORKS.localhost && import.meta.env.DEV
    ? new StaticJsonRpcProvider(NETWORKS.localhost.rpcUrl)
    : undefined;

const joeFactoryAddress = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10';
const joeRouterAddress = '0x60aE616a2155Ee3d9A68541Ba4544862310933d4';

export const JOE_FACTORY = new ethers.Contract(joeFactoryAddress, joeFactory);
export const JOE_ROUTER = new ethers.Contract(joeRouterAddress, joeRouter);
