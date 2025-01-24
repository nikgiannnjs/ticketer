import { Ticket } from "lucide-react";

export const Divider = () => {
  return (
    <div className="py-11 flex w-full gap-2 items-center">
      <div className="w-full h-px bg-gradient-to-r from-transparent to-muted-foreground/40" />
      <Ticket className="w-7 opacity-50 text-muted-foreground" />
      <div className="w-full h-px bg-gradient-to-l from-transparent to-muted-foreground/40" />
    </div>
  );
};
