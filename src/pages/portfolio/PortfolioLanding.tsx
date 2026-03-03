import { DesignSystemEditor } from "@design-alive/editor";
import { useSubscription } from "../../hooks/useSubscription";
import UserNav from "../../components/UserNav";

export default function PortfolioLanding() {
  const { licenseKey } = useSubscription();

  return (
    <DesignSystemEditor
      prEndpointUrl="/.netlify/functions/create-design-pr"
      accessibilityAudit={true}
      licenseKey={licenseKey}
      headerRight={<UserNav />}
    />
  );
}
