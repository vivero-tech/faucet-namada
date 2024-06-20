
import React, { useCallback, useContext, useEffect, useState } from "react";
import Modal from './Modal';

import './../css/mobile/mob_style.css';
import './../css/Loader.css';
import {
  ActionButton,
  Alert,
  AmountInput,
  Input,
  Select,
} from "@namada/components";
import { Namada } from "@namada/integrations";
import { Account } from "@namada/types";
import { bech32mValidation, shortenAddress } from "@namada/utils";
import './../css/Namada_UI.css';
import Loading from './Loading';
import { InfoContainer } from "./App.components";
import {
  ButtonContainer,
  FaucetFormContainer,
  FormStatus,
  InputContainer,
  PreFormatted,
} from "./Faucet.components";


enum Status {
  Pending,
  Completed,
  Error,
}

type Props = {
  accounts: Account[];
  integration: Namada;
  isTestnetLive: boolean;
 
};

const FaucetForm: React.FC<Props> = ({
  accounts,
  integration,
  isTestnetLive,
}) => {
  const accountLookup = accounts.reduce((acc, account) => {
    acc[account.address] = account;
    return acc;
  }, {} as Record<string, Account>);

  const [account, setAccount] = useState<Account>(accounts[0]);
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<Status>(Status.Completed);
  const [statusText, setStatusText] = useState<string>();
  const [isLoading, setIsLoading] = useState(false); 
  
  const [message, setMessage] = useState('Tokens successfully received!');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [showContent, setShowContent] = useState<boolean>(false);
  const apiUrl = process.env.NAMADA_INTERFACE_FAUCET_API_URL;
  const apiKey = process.env.NAMADA_INTERFACE_FAUCET_API_KEY;

  const accountsSelectData = accounts.map(({ alias, address }) => ({
    label: `${alias} - ${shortenAddress(address)}`,
    value: address,
  }));

  const handleLoad = (): void => {
    setShowContent(true);
  };
  const openModal = (message: string) => {
    setMessage(message);
    setIsModalVisible(true);
  };
    
  const sendAccountAddress = useCallback(async () => {
    if (!account || !account.address) {
      console.error("Account address is not available");
      return;
    }
    if (!apiUrl) {
      console.error("API URL is not available");
      return;
    }
    if (!apiKey) {
      console.error("API key is not available");
      return;
    }
    setIsLoading(true); 
    try {
      const response = await fetch(apiUrl, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ address: account.address }),
      });
  
      const data = await response.json();
      const messageText = data.message;
      console.log(messageText); 
      setIsLoading(false); 
      openModal(messageText); 
      
      setIsModalVisible(true);
    } catch (error) {
      if (error instanceof Error) {
        openModal(error.message);
      } 
    } finally {
      setIsLoading(false); 
    }
  }, [account?.address, apiUrl, apiKey]);
  

  return (
    <FaucetFormContainer>
      <InputContainer>
        {accounts.length > 0 ? (
          <Select
            data={accountsSelectData}
            value={account.address}
            label="Account"
            onChange={(e) => setAccount(accountLookup[e.target.value])}
          />
        ) : (
          <Alert type="error">You have no signing accounts! Import or create an account in the extension, then reload this page.</Alert>
        )}
      </InputContainer>

      {status !== Status.Error && (
        <FormStatus>
          {status === Status.Pending && (
            <InfoContainer>
              <Alert type="warning">Processing faucet transfer...</Alert>
            </InfoContainer>
          )}
          {status === Status.Completed && (
            <InfoContainer>
              <Alert type="info">{statusText}</Alert>
            </InfoContainer>
          )}
        </FormStatus>
      )}
      {status === Status.Error && <Alert type="error">{error}</Alert>}

      <ButtonContainer>
      <ActionButton
  style={{
    fontSize: "1.25rem",
    lineHeight: "1.6",
    padding: "0.6em 2.5em",
    margin: 0,
    backgroundColor: "#f4b003",
    color: "white",
  }}
  onClick={sendAccountAddress}
  disabled={!isTestnetLive || accounts.length === 0 || isLoading}
>
  <div className="GetTokens">{isLoading ? 
  <>
  <Loading onLoad={handleLoad} />
      {showContent}</>
  
  : 'Get Testnet Tokens'}</div>
</ActionButton>
      </ButtonContainer>
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        message={message}
      />


    </FaucetFormContainer>
  );
};

export default FaucetForm;

