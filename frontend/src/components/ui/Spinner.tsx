import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

type Props = {
  isLoading?: boolean;
  className?: string;
};

export const Spinner = ({ isLoading, className }: Props) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "w-full h-full",
        className
      )}
    >
      <LoaderCircle className="animate-spin text-white" />
    </div>
  );
};
