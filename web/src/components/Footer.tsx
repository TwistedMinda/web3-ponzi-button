import { useAddress } from 'hooks/useAddress';
import { useWalletConnect } from 'hooks/useWalletConnect';
import Button from './Button';
import './Footer.scss';

const Footer = () => {
  const { address } = useAddress();
  const { connect, disconnect } = useWalletConnect();
  return (
    <div className="footer col center">
      <Button onClick={address ? disconnect : connect}>
        {address ? 'Logout 👋' : 'Connect 🚀'}
      </Button>
      <a
        href="https://github.com/TwistedMinda/ponzi-button-web"
        className="link"
				target='_blank'
      >
        Github
      </a>
    </div>
  );
};

export default Footer;
