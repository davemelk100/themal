import React from "react";

const IconWrapper = ({
  Icon,
  className,
  fallback = "↗",
}: {
  Icon: React.LazyExoticComponent<React.ComponentType<any>>;
  className?: string;
  fallback?: string;
}) => (
  <React.Suspense fallback={<span className={className}>{fallback}</span>}>
    <Icon className={className} />
  </React.Suspense>
);

export default IconWrapper;
