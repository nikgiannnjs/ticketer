import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Event } from "@/hooks/useGetEvents";
import { formatCurrency } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/Button";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./ui/Modal";
import { useState } from "react";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import toast from "react-hot-toast";

type Props = {
  event: Event;
};

const R2_BUCKET = import.meta.env.VITE_R2_DEV_SUBDOMAIN;

export function EventCard({ event }: Props) {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: deleteEvent, isLoading: isDeleting } = useDeleteEvent();

  const datetime = new Date(event.datetime);
  const remainingTickets = event.capacity - event.ticketsBooked;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/edit-event/${event._id}`);
  };

  const handleDelete = () => {
    deleteEvent(event._id, {
      onSuccess: () => {
        toast.success("Event deleted successfully");
        setIsDeleteModalOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete event");
      },
    });
  };

  return (
    <Link to={`/event/${event._id}`}>
      <Card className="w-full hover:shadow-lg transition-shadow cursor-pointer relative max-w-[385px]">
        {accessToken && (
          <div
            className="absolute top-2 right-2 flex gap-2 z-10"
            onClick={(e) => e.preventDefault()}
          >
            <Button
              size="sm"
              className="opacity-100 hover:opacity-80"
              onClick={handleEdit}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
              <ModalTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="opacity-100 hover:opacity-80"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Delete Event</ModalTitle>
                  <ModalDescription>
                    Are you sure you want to delete this event? This action
                    cannot be undone.
                  </ModalDescription>
                </ModalHeader>
                <ModalFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        )}
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={`${R2_BUCKET}${event.image}`}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{event.title}</CardTitle>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              {datetime.toLocaleDateString()} at{" "}
              {datetime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>{formatCurrency(event.price)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {event.description}
          </p>
          <div className="flex justify-between items-center text-sm gap-2 flex-wrap">
            <span>
              {event.city}, {event.country}
            </span>
            <span
              className={
                remainingTickets < 10
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              {remainingTickets} / {event.capacity} available seats
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
