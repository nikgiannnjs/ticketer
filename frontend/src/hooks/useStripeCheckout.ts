import { useMutation } from "react-query";
import { axios } from "@/lib/axios";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";

type StripeCheckoutData = {
  eventId: string;
  email: string;
  ticketAmount: number;
};

export function useStripeCheckout() {
  return useMutation<void, Error, StripeCheckoutData>(
    async ({ eventId, email, ticketAmount }) => {
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      );
      if (!stripe) throw new Error("Failed to load Stripe");

      const response = await axios.post(`/tickets/holdTicket/${eventId}`, {
        email,
        ticketAmount,
      });

      localStorage.setItem("stripe_session_id", response.data.stripeSessionId);

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.stripeSessionId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to process payment");
      }
    },
    {
      onError: (error) => {
        toast.error(error.message || "Failed to purchase tickets");
      },
    }
  );
}
