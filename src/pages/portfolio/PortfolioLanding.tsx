import { DesignSystemEditor } from "@design-alive/editor";

export default function PortfolioLanding() {
  return (
    <DesignSystemEditor
      prEndpointUrl="/.netlify/functions/create-design-pr"
      accessibilityAudit={true}
    />
  );
}
