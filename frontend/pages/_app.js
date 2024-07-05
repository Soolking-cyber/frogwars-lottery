import "../styles/globals.css";
import {NotificationProvider} from 'web3uikit'
import { ThirdwebProvider } from "thirdweb/react";
import { linea } from "thirdweb/chains";

function MyApp({ Component, pageProps }) {


  return (
      <ThirdwebProvider
        supportedChains={[linea]}
        activeChain={linea}
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      >
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </ThirdwebProvider>
  );
}

export default MyApp;
