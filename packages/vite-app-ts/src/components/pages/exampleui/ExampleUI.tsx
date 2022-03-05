/* */
import { PlusSquareOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { List, Layout, Select, Input, Collapse } from 'antd';
import { Address } from 'eth-components/ant';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useContractReader, useEventListener, useGasPrice } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { BigNumber, utils, ethers } from 'ethers';
import React, { useState, FC, useContext, ReactNode, useCallback, useEffect } from 'react';

import * as joeTokens from './tokensMetadata/JoeTokens.json';

import { useAppContracts } from '~~/config/contractContext';
import { SetPurposeEvent } from '~~/generated/contract-types/YourContract';
const { Panel } = Collapse;
const avaxLogo =
  'https://media.discordapp.net/attachments/944459435475079189/944459543570685983/avalanche-avax-logo.png';
const ftmLogo = 'https://media.discordapp.net/attachments/944459435475079189/944459543788814336/ftm.png';
const ethLogo = 'https://cdn.discordapp.com/attachments/944459435475079189/948058148969783336/ethereum-eth-logo.png';

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
  const [avaxTokens] = useState(joeTokens.tokens);
  const [token0, setToken0] = useState('');
  const [token0Balance, setToken0Balance] = useState(0);
  const [token1Balance, setToken1Balance] = useState(0);
  const [token0Connected, setToken0Connected] = useState<any>(null);
  const [token1, setToken1] = useState('');
  const [token1Connected, setToken1Connected] = useState<any>(null);
  const [token0Amount, setToken0Amount] = useState<any>(null);
  const [token1Amount, setToken1Amount] = useState<any>(null);
  const [LPTokenAmount, setLPTokenAmount] = useState<any>(null);
  const [decimalToken0, setDecimalToken0] = useState<any>(null);
  const [decimalToken1, setDecimalToken1] = useState<any>(null);
  const [lpToken, setLpToken] = useState('');

  // force update hack
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState(undefined), []);

  const [ERC20Token, setERC20Token] = useState(
    new utils.Interface([
      'function totalSupply() external view returns (uint256)',
      'function balanceOf(address owner) view returns (uint)',
      'function approve(address spender, uint256 amount) external returns (bool)',
      'function transferFrom(address from,address to,uint256 amount) external returns (bool)',
      'function decimals() external view returns (uint8)',
    ])
  );

  const [zapScenario, setZapScenario] = useState('');

  const fetchBalance = useCallback(async () => {
    const balanceToken0 = await token0Connected.balanceOf(address);
    const decimalToken0 = await token0Connected.decimals();
    console.log('decimalToken0', decimalToken0);
    const balanceToken1 = await token1Connected.balanceOf(address);
    const decimalToken1 = await token1Connected.decimals();
    console.log('decimalToken1', decimalToken1);

    setDecimalToken0(decimalToken0);
    setToken0Balance(balanceToken0);

    setDecimalToken1(decimalToken1);
    setToken1Balance(balanceToken1);
    // forceUpdate();
  }, [token1Connected, token0Connected]);

  useEffect(() => {
    forceUpdate();
  }, [forceUpdate]);
  useEffect(() => {
    fetchBalance();
  }, [token1Connected, token0Connected]);
  // useEffect(() => {
  //   const bal = async () => {
  //     if (token0Connected && token1Connected) {
  //       await fetchBalance();
  //       console.log('fetching balance');
  //     }
  //   };

  //   bal().catch(console.error);
  // }, [fetchBalance, token1Connected, token0Connected]);

  function getContractConnected(address: string, signer: ethers.Signer): ethers.BaseContract {
    return new ethers.Contract(address, ERC20Token, signer);
  }

  function getContractUnconnected(address: string): ethers.Contract {
    return new ethers.Contract(address, ERC20Token, signer);
  }

  function parseBalance(value: number) {
    const val = value.toString();
    console.log('BEFORE: ', val);
    if (Number(val) <= Number(0.0099)) {
      console.log('BALANCE LESS: ', val);
      return 0;
    }
    console.log('BALANCE greater: ', val);
    return value;
  }

  function onChangeToken0(value: any) {
    setToken0(value);
    const connected = getContractUnconnected(value);
    setToken0Connected(connected);
    console.log('TEST: ', getContractUnconnected(value));
    console.log(`selected ${value}`);
  }

  function onSearchToken0(val: any) {
    console.log('search:', val);
  }
  function onChangeToken1(value: any) {
    setToken1(value);
    const connected = getContractUnconnected(value);
    setToken1Connected(connected);
    console.log('TEST: ', getContractUnconnected(value));
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
        <div
          style={{
            width: '70%',
            display: 'block',
            margin: 'auto',
            padding: '1em',
          }}>
          <Collapse style={{ color: 'blue' }} defaultActiveKey={['1']}>
            {/* SELECT DEPOSIT TYPE */}
            <Panel header="Select Your Starting Point" key="1" style={{ minHeight: '10em' }}>
              {zapScenario && (
                <>
                  <div>
                    <a
                      style={{ float: 'left', marginRight: '-2em' }}
                      onClick={() => {
                        setZapScenario('');
                        setToken0('');
                        setToken1('');
                      }}>
                      RESET
                    </a>
                  </div>
                </>
              )}

              {/* DEPOSIT TYPE */}
              {!zapScenario && (
                <>
                  <div
                    style={{
                      width: '33%',
                      margin: 'auto',
                      display: 'inline-block',
                    }}>
                    <h2>Single Token Zap into LP</h2>
                    {ethersContext.chainId === 43114 && (
                      <img
                        style={{
                          objectFit: 'cover',
                          width: '5em',
                          height: '5em',
                          borderRadius: '50%',
                          margin: '0.3em',
                          display: 'inline-block',
                        }}
                        src={avaxLogo}
                        alt="AVAX1 LOGO"
                        onClick={() => {
                          setZapScenario('SingleZap');
                          forceUpdate();
                        }}
                      />
                    )}
                    {ethersContext.chainId === 250 && (
                      <img
                        style={{
                          objectFit: 'cover',
                          width: '5em',
                          height: '5em',
                          borderRadius: '50%',
                          margin: '0.3em',
                          display: 'inline-block',
                        }}
                        src={ftmLogo}
                        alt="FTM1 LOGO"
                        onClick={() => {
                          setZapScenario('SingleZap');
                          forceUpdate();
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      width: '33%',
                      margin: 'auto',
                      display: 'inline-block',
                    }}>
                    <h2>Two Token Zap into LP</h2>
                    {ethersContext.chainId === 43114 && (
                      <>
                        <div
                          onClick={() => {
                            setZapScenario('DualZap');
                            forceUpdate();
                          }}
                          style={{
                            marginTop: '1em',
                          }}>
                          <img
                            style={{
                              objectFit: 'cover',
                              width: '3em',
                              height: '3em',
                              marginBottom: '0.3em',
                              borderRadius: '50%',
                              display: 'inline-block',
                            }}
                            src={avaxLogo}
                            alt="AVAX2 LOGO"
                          />
                          <PlusSquareOutlined style={{ display: 'inline-block', fontSize: '2em', padding: '0.5em' }} />
                          <img
                            style={{
                              objectFit: 'cover',
                              width: '3em',
                              height: '3em',
                              marginBottom: '0.3em',
                              borderRadius: '50%',
                              display: 'inline-block',
                            }}
                            src={ethLogo}
                            alt="ETH1 LOGO"
                          />
                        </div>
                      </>
                    )}
                    {ethersContext.chainId === 250 && (
                      <>
                        <div
                          onClick={() => {
                            setZapScenario('DualZap');
                            forceUpdate();
                          }}
                          style={{
                            marginTop: '1em',
                          }}>
                          <img
                            style={{
                              objectFit: 'cover',
                              width: '3em',
                              height: '3em',
                              marginBottom: '0.3em',
                              borderRadius: '50%',
                              display: 'inline-block',
                            }}
                            src={ftmLogo}
                            alt="FTM2 LOGO"
                          />
                          <PlusSquareOutlined style={{ display: 'inline-block', fontSize: '2em', padding: '0.5em' }} />
                          <img
                            style={{
                              objectFit: 'cover',
                              width: '3em',
                              height: '3em',
                              marginBottom: '0.3em',
                              borderRadius: '50%',
                              display: 'inline-block',
                            }}
                            src={ethLogo}
                            alt="ETH2 LOGO"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    style={{
                      width: '33%',
                      margin: 'auto',
                      display: 'inline-block',
                    }}>
                    <h2>BYOLP</h2>
                    {ethersContext.chainId === 43114 && (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 'auto',
                          }}
                          onClick={() => {
                            setZapScenario('LP');
                            forceUpdate();
                          }}>
                          <div
                            style={{
                              margin: 'auto',
                              zIndex: '2',
                            }}>
                            <img
                              style={{
                                objectFit: 'cover',
                                width: '4em',
                                height: '4em',
                                borderRadius: '50%',
                                display: 'inline-block',
                              }}
                              src={avaxLogo}
                              alt="AVAX3 LOGO"
                            />
                          </div>
                          <div
                            style={{
                              position: 'relative',
                              top: '0em',
                              left: '-6em',
                            }}>
                            <img
                              style={{
                                objectFit: 'cover',
                                width: '4em',
                                height: '4em',
                                borderRadius: '50%',
                                display: 'inline-block',
                                zIndex: '2',
                              }}
                              src={ethLogo}
                              alt="ETH3 LOGO"
                              onClick={() => {
                                setZapScenario('LP');
                                forceUpdate();
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {ethersContext.chainId === 250 && (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 'auto',
                          }}
                          onClick={() => {
                            setZapScenario('LP');
                            forceUpdate();
                          }}>
                          <div
                            style={{
                              margin: 'auto',
                              zIndex: '2',
                            }}>
                            <img
                              style={{
                                objectFit: 'cover',
                                width: '4em',
                                height: '4em',
                                borderRadius: '50%',
                                display: 'inline-block',
                              }}
                              src={ftmLogo}
                              alt="FTM3 LOGO"
                            />
                          </div>
                          <div
                            style={{
                              position: 'relative',
                              top: '0em',
                              left: '-6em',
                            }}>
                            <img
                              style={{
                                objectFit: 'cover',
                                width: '4em',
                                height: '4em',
                                borderRadius: '50%',
                                display: 'inline-block',
                                zIndex: '2',
                              }}
                              src={ethLogo}
                              alt="ETH4 LOGO"
                              onClick={() => {
                                setZapScenario('LP');
                                forceUpdate();
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
              {zapScenario && (
                <>
                  {zapScenario === 'SingleZap' && (
                    <>
                      <h1>Zap Source</h1>
                      <div style={{ display: 'inline-block', fontSize: '15px' }}>
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
                                      padding: '0.1em',
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
                      {token0 && (
                        <>
                          <div style={{ width: '100%', alignContent: 'center', marginTop: ' 2em' }}>
                            <Input
                              type="number"
                              style={{ maxWidth: '30%' }}
                              placeholder="Amount"
                              prefix={
                                <img
                                  style={{
                                    objectFit: 'cover',
                                    width: '2em',
                                    height: '2em',
                                    borderRadius: '50%',
                                    margin: '0.3em',
                                    display: 'inline-block',
                                  }}
                                  src={avaxTokens.find((t) => t.address === token0)?.logoURI}
                                  alt={token0}
                                />
                              }
                              suffix={
                                <>
                                  <h1>Balance :</h1>
                                  <a
                                    onClick={(e) => {
                                      setToken0Amount(Number(token0Balance / 10 ** decimalToken0).toFixed(5));
                                    }}>
                                    {Number(token0Balance / 10 ** decimalToken0).toFixed(2)}
                                  </a>
                                </>
                              }
                              onChange={(e) => setToken0Amount(e.target.value)}
                              value={token0Amount}
                            />
                            <div style={{ padding: '1em', width: '100%', alignContent: 'center' }}>
                              <PlusSquareOutlined style={{ fontSize: '3em' }} />
                            </div>
                            <h1>Token To Create LP With</h1>
                            <div style={{ padding: '1em', width: '100%', alignContent: 'center' }}>
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

                            {token1 && (
                              <>
                                <Input
                                  type="number"
                                  style={{ maxWidth: '30%' }}
                                  placeholder="Amount"
                                  prefix={
                                    <img
                                      style={{
                                        objectFit: 'cover',
                                        width: '2em',
                                        height: '2em',
                                        borderRadius: '50%',
                                        margin: '0.3em',
                                        display: 'inline-block',
                                      }}
                                      src={avaxTokens.find((t) => t.address === token1)?.logoURI}
                                      alt={token1}
                                    />
                                  }
                                  suffix={
                                    <>
                                      Max:
                                      <a
                                        onClick={(e) => {
                                          setToken1Amount(Number(token1Balance / 10 ** decimalToken1).toFixed(5));
                                        }}>
                                        {Number(token1Balance / 10 ** decimalToken1).toFixed(2)}
                                      </a>
                                    </>
                                  }
                                  onChange={(e) => setToken1Amount(e.target.value)}
                                  value={token1Amount}
                                />
                              </>
                            )}
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
                          {}
                          <div>
                            <h2>LP Tokens Recieved</h2>
                            {/* {ethers.utils.formatEther(token0Balance.toString())}
              {ethers.utils.formatEther(token1Balance.toString())} */}
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {zapScenario === 'DualZap' && (
                    <>
                      <h1>Provide LP</h1>
                      {avaxTokens && (
                        <>
                          {/* token 0 input */}
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
                                          padding: '0.1em',
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
                          {/* token 1 input */}
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
                          <div style={{ padding: '1em' }} />
                          {token0 && token1 && (
                            <>
                              <div style={{ width: '100%', alignContent: 'center', marginTop: ' 2em' }}>
                                <Input
                                  type="number"
                                  style={{ maxWidth: '30%' }}
                                  placeholder="Amount"
                                  prefix={
                                    <img
                                      style={{
                                        objectFit: 'cover',
                                        width: '2em',
                                        height: '2em',
                                        borderRadius: '50%',
                                        margin: '0.3em',
                                        display: 'inline-block',
                                      }}
                                      src={avaxTokens.find((t) => t.address === token0)?.logoURI}
                                      alt={token0}
                                    />
                                  }
                                  suffix={
                                    <>
                                      <h1 style={{ fontSize: '15px' }}>Balance :</h1>
                                      <a
                                        onClick={(e) => {
                                          setToken0Amount(Number(token0Balance / 10 ** decimalToken0).toFixed(5));
                                        }}>
                                        {Number(token0Balance / 10 ** decimalToken0).toFixed(2)}
                                      </a>
                                    </>
                                  }
                                  onChange={(e) => setToken0Amount(e.target.value)}
                                  value={token0Amount}
                                />
                                <div style={{ padding: '1em', width: '100%', alignContent: 'center' }}>
                                  <PlusSquareOutlined style={{ fontSize: '3em' }} />
                                </div>
                                <Input
                                  type="number"
                                  style={{ maxWidth: '30%' }}
                                  placeholder="Amount"
                                  prefix={
                                    <img
                                      style={{
                                        objectFit: 'cover',
                                        width: '2em',
                                        height: '2em',
                                        borderRadius: '50%',
                                        margin: '0.3em',
                                        display: 'inline-block',
                                      }}
                                      src={avaxTokens.find((t) => t.address === token1)?.logoURI}
                                      alt={token1}
                                    />
                                  }
                                  suffix={
                                    <>
                                      Max:
                                      <a
                                        onClick={(e) => {
                                          setToken1Amount(Number(token1Balance / 10 ** decimalToken1).toFixed(5));
                                        }}>
                                        {Number(token1Balance / 10 ** decimalToken1).toFixed(2)}
                                      </a>
                                    </>
                                  }
                                  onChange={(e) => setToken1Amount(e.target.value)}
                                  value={token1Amount}
                                />
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

                              <div>
                                <h2>LP Tokens Recieved</h2>

                                {/* {ethers.utils.formatEther(token0Balance.toString())}
              {ethers.utils.formatEther(token1Balance.toString())} */}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {zapScenario === 'LP' && (
                    <>
                      <h1>Select Your LP</h1>
                      <div
                        style={{
                          display: 'inline-block',
                          float: 'left',
                          paddingLeft: '15%',
                          paddingTop: '1em',
                          fontSize: '15px',
                        }}>
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
                                      padding: '0.1em',
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
                      <div style={{ display: 'inline-block', padding: '1em', alignContent: 'center' }}>
                        <PlusSquareOutlined style={{ fontSize: '3em' }} />
                      </div>
                      {/* token 1 input */}
                      <div style={{ display: 'inline-block', float: 'right', paddingRight: '15%', paddingTop: '1em' }}>
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
                      {token0 && token1 && (
                        <>
                          <div>
                            <ArrowDownOutlined style={{ fontSize: '3em', marginTop: '0.3em' }} />
                          </div>
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

                          <div>
                            <h2>LP Tokens Recieved</h2>
                            <Input
                              type="number"
                              style={{ maxWidth: '30%' }}
                              placeholder="Amount"
                              prefix={
                                <>
                                  <img
                                    style={{
                                      objectFit: 'cover',
                                      width: '2em',
                                      height: '2em',
                                      borderRadius: '50%',
                                      margin: '0.3em',
                                      display: 'inline-block',
                                    }}
                                    src={avaxTokens.find((t) => t.address === token1)?.logoURI}
                                    alt={token1}
                                  />
                                  <img
                                    style={{
                                      objectFit: 'cover',
                                      width: '2em',
                                      height: '2em',
                                      borderRadius: '50%',
                                      margin: '0.3em',
                                      display: 'inline-block',
                                    }}
                                    src={avaxTokens.find((t) => t.address === token0)?.logoURI}
                                    alt={token0}
                                  />
                                </>
                              }
                              suffix={
                                <>
                                  Max:
                                  <a
                                    onClick={(e) => {
                                      setToken1Amount(Number(token1Balance / 10 ** decimalToken1).toFixed(5));
                                    }}>
                                    {Number(token1Balance / 10 ** decimalToken1).toFixed(2)}
                                  </a>
                                </>
                              }
                              onChange={(e) => setToken1Amount(e.target.value)}
                              value={token1Amount}
                            />
                            {/* {ethers.utils.formatEther(token0Balance.toString())}
              {ethers.utils.formatEther(token1Balance.toString())} */}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Panel>
            {/* SELECT DEX DESTINATION */}
            <Panel header="Select Your Dex" key="2"></Panel>
            {/* SELECT FARM DESTINATION */}
            <Panel header="Select Your Farm" key="3"></Panel>
            {/* SELECT YOUR COMPOUNDING STRATEGY */}
            <Panel header="Create Your Flywheel" key="4"></Panel>
          </Collapse>
        </div>
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
