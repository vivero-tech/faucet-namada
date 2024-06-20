import React, { createContext, useCallback, useEffect, useState } from "react";
import './../css/Namada_UI.css';
import './../css/button.css';
import './../css/mobile/mob_style.css';
import { urip } from './share';


// import { ActionButton, Alert, Heading } from "@namada/components";
import { Namada } from "@namada/integrations";
import  FaucetForm  from "./Faucet";
import { chains } from "@namada/chains";
import { useUntil } from "@namada/hooks";
import { Account, AccountType } from "@namada/types";



type Settings = {
  difficulty?: number;
  tokens?: Record<string, string>;
  startsAt: number;
  startsAtText?: string;
};



const START_TIME_UTC = 1702918800;
const START_TIME_TEXT = new Date(START_TIME_UTC * 1000).toLocaleString(
  "en-gb",
  {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }
);

const defaults = {
  startsAt: START_TIME_UTC,
  startsAtText: `${START_TIME_TEXT} UTC`,
};


enum ExtensionAttachStatus {
  PendingDetection,
  NotInstalled,
  Installed,
}

export const App: React.FC = () => {

  const [ipAddress, setIPAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        const response = await fetch(urip);
        const data = await response.json();
        setIPAddress(data.ip);
        
      } catch (error) {
        console.error('Error fetching IP address:', error);
        setIPAddress(null);
      }
    };

    fetchIPAddress();
    return () => {
    };
  }, []);










  const chain = chains.namada;
  const integration = new Namada(chain);
  const [extensionAttachStatus, setExtensionAttachStatus] = useState(
    ExtensionAttachStatus.PendingDetection
  );
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [isTestnetLive, setIsTestnetLive] = useState(true);


  useUntil(
    {
      predFn: async () => Promise.resolve(integration.detect()),
      onSuccess: () => {
        setExtensionAttachStatus(ExtensionAttachStatus.Installed);
      },
      onFail: () => {
        setExtensionAttachStatus(ExtensionAttachStatus.NotInstalled);
      },
    },
    { tries: 5, ms: 300 },
    [integration]
  );

  const handleConnectExtensionClick = useCallback(async (): Promise<void> => {
    if (integration) {
      try {
        const isIntegrationDetected = integration.detect();

        if (!isIntegrationDetected) {
          throw new Error("Extension not installed!");
        }

        await integration.connect();
        const accounts = await integration.accounts();
        if (accounts) {
          setAccounts(
            accounts.filter(
              (account) =>
                !account.isShielded && account.type !== AccountType.Ledger
            )
          );
        }
        setIsExtensionConnected(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, [integration]);

  return (
   
    
        <div className="faucet-container">
          {extensionAttachStatus === ExtensionAttachStatus.PendingDetection && (
            <div className="button-container">
              <div className="alert alert-info">Detecting extension...</div>
            </div>
          )}
          {extensionAttachStatus === ExtensionAttachStatus.NotInstalled && (
            <div className="button-container">
              <div className="alert alert-error">You must download the extension!</div>
            </div>
          )}
          {isExtensionConnected && (
            <FaucetForm
              isTestnetLive={isTestnetLive}
              accounts={accounts}
              integration={integration}
            />
          )}
          {extensionAttachStatus === ExtensionAttachStatus.Installed && !isExtensionConnected && (
         

            <div className="button-box">

            <a className="action-button" href="#" onClick={handleConnectExtensionClick}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Connect to Namada Extension
            </a>

            </div>


          )}
        </div>
   
 
  );
};
