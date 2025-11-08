import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }Props) => (
  
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}Props & { withHandle }) => (
  
    {withHandle && (

    )}
  
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

