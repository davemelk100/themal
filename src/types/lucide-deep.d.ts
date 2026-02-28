// Type declarations for lucide-react deep icon imports
declare module "lucide-react/dist/esm/icons/*" {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
  const icon: ForwardRefExoticComponent<
    RefAttributes<SVGSVGElement> & Partial<SVGProps<SVGSVGElement>> & {
      size?: string | number;
      absoluteStrokeWidth?: boolean;
    }
  >;
  export default icon;
}
