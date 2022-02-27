import { getNetwork } from '@ethersproject/networks';
import { Alert, PageHeader } from 'antd';
import { Account } from 'eth-components/ant';
import { useGasPrice } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import React, { FC, ReactElement } from 'react';

import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { getNetworkInfo } from '~~/functions';

// displays a page header
export interface IMainPageHeaderProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
}

/**
 * ✏ Header: Edit the header and change the title to your project name.  Your account is on the right *
 * @param props
 * @returns
 */
export const MainPageHeader: FC<IMainPageHeaderProps> = (props) => {
  const ethersContext = useEthersContext();
  const selectedChainId = ethersContext.chainId;

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast', getNetworkInfo(ethersContext.chainId));

  /**
   * this shows the page header and other informaiton
   */
  const left = (
    <>
      <div>
        <img
          src="https://uploads.codesandbox.io/uploads/user/ec99cf90-9270-41c2-9b72-7cb10eee778e/WSE8-FlyWheelLogo2.png"
          alt="logo"
          style={{
            width: '11em',
            height: '11em',
            display: 'inline-block',
            float: 'left',
            padding: '5px',
            margin: '5px',
          }}
        />
        <PageHeader
          title=""
          subTitle={<span>A Self Custodial, Decentralized, Auto-Compounding protocol</span>}
          style={{ cursor: 'pointer' }}
        />
      </div>
      {props.children}
    </>
  );

  /**
   * 👨‍💼 Your account is in the top right with a wallet at connect options
   */
  const right = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10, zIndex: 1 }}>
      <Account
        createLoginConnector={props.scaffoldAppProviders.createLoginConnector}
        ensProvider={props.scaffoldAppProviders.mainnetAdaptor?.provider}
        price={props.price}
        blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        hasContextConnect={true}
      />
      {/* <FaucetHintButton scaffoldAppProviders={props.scaffoldAppProviders} gasPrice={gasPrice} /> */}
      {props.children}
    </div>
  );

  /**
   * display the current network on the top left
   */
  let networkDisplay: ReactElement | undefined;
  if (selectedChainId && selectedChainId !== (Number(43114) || Number(250))) {
    if (selectedChainId !== 250) {
      const description = (
        <div>
          You have <b>{getNetwork(selectedChainId)?.name}</b> selected and you need to be on{' '}
          <b>{'Fantom or Avalanche'}</b>.
        </div>
      );
      networkDisplay = (
        <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 90, padding: 16 }}>
          <Alert message="⚠️ Wrong Network" description={description} type="error" closable={false} />
        </div>
      );
    } else {
      const description = (
        <div>
          You have <b>{getNetwork(selectedChainId)?.name}</b> selected and you need to be on{' '}
          <b>{'Fantom or Avalanche'}</b>.
        </div>
      );
      networkDisplay = (
        <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 90, padding: 16 }}>
          <Alert message="⚠️ Wrong Network" description={description} type="error" closable={false} />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 84,
          padding: 10,
          color: props.scaffoldAppProviders.targetNetwork.color,
        }}>
        {props.scaffoldAppProviders.targetNetwork.name}
      </div>
    );
  }

  return (
    <>
      {left}
      {networkDisplay}
      {right}
    </>
  );
};
