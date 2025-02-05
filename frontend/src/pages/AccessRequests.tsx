import { useGetAccessRequests } from "@/hooks/useGetAccessRequests";
import { useAcceptAccessRequest } from "@/hooks/useAcceptAccessRequest";
import { useRejectAccessRequest } from "@/hooks/useRejectAccessRequest";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import { Check, X } from "lucide-react";

export default function AccessRequests() {
  const { data: requests, isLoading, refetch } = useGetAccessRequests();
  const { mutate: acceptRequest, isLoading: isAccepting } =
    useAcceptAccessRequest();
  const { mutate: rejectRequest, isLoading: isRejecting } =
    useRejectAccessRequest();

  const handleAccept = (email: string) => {
    acceptRequest(email, {
      onSuccess: () => {
        toast.success("Request accepted successfully");
        refetch();
      },
      onError: () => {
        toast.error("Failed to accept request");
      },
    });
  };

  const handleReject = (email: string) => {
    rejectRequest(email, {
      onSuccess: () => {
        toast.success("Request rejected successfully");
        refetch();
      },
      onError: () => {
        toast.error("Failed to reject request");
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold">Access Requests</h1>
      {requests?.length === 0 ? (
        <Card className="p-4">
          <p className="text-muted-foreground">No pending access requests</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests?.map((request: { email: string }) => (
            <Card key={request.email} className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-lg">{request.email}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAccept(request.email)}
                    disabled={isAccepting || isRejecting}
                    variant="default"
                    className="gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleReject(request.email)}
                    disabled={isAccepting || isRejecting}
                    variant="destructive"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
