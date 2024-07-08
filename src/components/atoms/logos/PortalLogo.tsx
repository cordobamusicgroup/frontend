import Image from "next/image";

interface PortalLogoProps {
  small?: boolean;
}

const PortalLogo: React.FC<PortalLogoProps> = ({ small }) => {
  return <Image src={small ? "/static/iconcmg.svg" : "/static/logocmg.svg"} alt="CMG Logo" width={0} height={0} style={{ width: small ? "40px" : "140px", height: "auto" }} priority />;
};

export default PortalLogo;
