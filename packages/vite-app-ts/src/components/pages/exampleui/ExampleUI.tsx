/* */
import { PlusSquareOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { List, Layout, Select } from 'antd';
import { Address } from 'eth-components/ant';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useContractReader, useEventListener, useGasPrice } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { BigNumber } from 'ethers';
import React, { useState, FC, useContext, ReactNode } from 'react';

import * as joeTokens from './tokensMetadata/JoeTokens.json';

import { useAppContracts } from '~~/config/contractContext';
import { SetPurposeEvent } from '~~/generated/contract-types/YourContract';

export interface IExampleUIProps {
  mainnetProvider: StaticJsonRpcProvider | undefined;
  yourCurrentBalance: BigNumber | undefined;
  price: number;
}

export const ExampleUI: FC<IExampleUIProps> = (props) => {
  const [newPurpose, setNewPurpose] = useState('loading...');
  const ethersContext = useEthersContext();

  const yourContract = useAppContracts('YourContract', ethersContext.chainId);
  const [purpose] = useContractReader(yourContract, yourContract?.purpose, [], yourContract?.filters.SetPurpose());

  const [setPurposeEvents] = useEventListener<SetPurposeEvent>(yourContract, yourContract?.filters.SetPurpose(), 1);

  const signer = ethersContext.signer;
  const address = ethersContext.account ?? '';

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast');
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  const { mainnetProvider, yourCurrentBalance, price } = props;
  const { Header, Footer, Sider, Content } = Layout;
  const { Option } = Select;
  const [avaxTokens, setAvaxTokens] = useState(joeTokens.tokens);
  const [token0, setToken0] = useState('');
  const [token1, setToken1] = useState('');
  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');
  const [lpToken, setLpToken] = useState('');

  function onChangeToken0(value: any) {
    setToken0(value);
    console.log(`selected ${value}`);
  }

  function onSearchToken0(val: any) {
    console.log('search:', val);
  }
  function onChangeToken1(value: any) {
    setToken1(value);
    console.log(`selected ${value}`);
  }

  function onSearchToken1(val: any) {
    console.log('search:', val);
  }
  function TokenList() {
    return (
      <>
        {avaxTokens.map((t) => (
          <Option value={t.address}>{t.symbol}</Option>
        ))}
      </>
    );
  }

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}

      <div
        style={{
          border: '3px solid #cccccc',
          padding: 16,
          width: '80%',
          margin: 'auto',
          marginTop: 64,
          borderRadius: '100px',
          background: 'rgba(102, 102, 102, 0.22)',
        }}>
        <h2 style={{ margin: '1em', fontSize: '30px' }}>Initialize Your Compounder</h2>

        {avaxTokens && (
          <>
            <div style={{ display: 'inline-block', float: 'left', paddingLeft: '25%', fontSize: '15px' }}>
              <Select
                showSearch
                placeholder="Select a Token"
                optionFilterProp="children"
                onChange={onChangeToken0}
                onSearch={onSearchToken0}
                filterOption={(input, option) =>
                  String(option!.children).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {avaxTokens.map((t) => {
                  return (
                    <>
                      <Option value={t.address}>
                        <img
                          style={{
                            objectFit: 'cover',
                            width: '2em',
                            height: '2em',
                            borderRadius: '50%',
                            margin: '0.3em',
                            display: 'inline-block',
                          }}
                          src={t.logoURI}
                          alt={t.address}
                        />
                        {t.symbol}
                      </Option>
                    </>
                  );
                })}
              </Select>
            </div>
            <div style={{ display: 'inline-block', float: 'right', paddingRight: '25%' }}>
              <Select
                showSearch
                placeholder="Select a Token"
                optionFilterProp="children"
                onChange={onChangeToken1}
                onSearch={onSearchToken1}
                filterOption={(input, option) =>
                  String(option!.children).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {avaxTokens.map((t) => {
                  return (
                    <>
                      <Option value={t.address}>
                        <img
                          style={{
                            objectFit: 'cover',
                            width: '2em',
                            height: '2em',
                            borderRadius: '50%',
                            margin: '0.3em',
                            display: 'inline-block',
                          }}
                          src={t.logoURI}
                          alt={t.address}
                        />
                        {t.symbol}
                      </Option>
                    </>
                  );
                })}
              </Select>
            </div>
          </>
        )}

        <div style={{ marginTop: '10%' }} />
        {token0 && token1 && (
          <>
            <div style={{ width: '100%', alignContent: 'center' }}>
              <h3></h3>
              <div style={{ float: 'left', marginLeft: '25%' }}>
                <img
                  style={{
                    objectFit: 'cover',
                    width: '4em',
                    height: '4em',
                    borderRadius: '50%',
                    margin: '0.3em',
                    display: 'inline-block',
                  }}
                  src={avaxTokens.find((t) => t.address === token0)?.logoURI}
                  alt={token0}
                />
              </div>
              <PlusSquareOutlined style={{ fontSize: '5em' }} />
              <div style={{ float: 'right', marginRight: '25%' }}>
                <img
                  style={{
                    objectFit: 'cover',
                    width: '4em',
                    height: '4em',
                    borderRadius: '50%',
                    margin: '0.3em',
                    display: 'inline-block',
                  }}
                  src={avaxTokens.find((t) => t.address === token1)?.logoURI}
                  alt={token1}
                />
              </div>
            </div>
            <ArrowDownOutlined style={{ fontSize: '5em', marginTop: '0.3em' }} />
            <div>
              <h2 style={{ margin: '1em', fontSize: '20px' }}>Zapping Into</h2>
              <div style={{ marginRight: '3em' }}>
                <img
                  style={{
                    objectFit: 'cover',
                    width: '4em',
                    height: '4em',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: '50%',
                  }}
                  src={avaxTokens.find((t) => t.address === token1)?.logoURI}
                  alt={token1}
                />
                <img
                  style={{
                    objectFit: 'cover',
                    width: '4em',
                    height: '4em',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                  src={avaxTokens.find((t) => t.address === token0)?.logoURI}
                  alt={token0}
                />
              </div>
              {avaxTokens.find((t) => t.address === token0)?.symbol}/
              {avaxTokens.find((t) => t.address === token1)?.symbol} LP
              <div></div>
            </div>

            <div></div>
          </>
        )}
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <div style={{ width: 600, margin: 'auto', marginTop: 32, paddingBottom: 32 }}>
        <h2>Events:</h2>
        <List
          bordered
          dataSource={setPurposeEvents}
          renderItem={(item: SetPurposeEvent): ReactNode => {
            return (
              <List.Item key={item.blockNumber + '_' + item.address}>
                <Address address={item.address} ensProvider={mainnetProvider} fontSize={16} /> {' - '}
                {item.args.purpose}
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
};
