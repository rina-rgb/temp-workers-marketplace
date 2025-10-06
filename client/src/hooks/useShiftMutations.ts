import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { Shift } from "../types";
import { useCurrentWorker } from "./useWorker";

type ClaimShiftCallbacks = {
  onSuccess?: (message: string, claimedShift: Shift) => void;
  onError?: (message: string) => void;
};

type MutationCallbacks = {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

type CancelResult = { shift: Shift; status: 'cancelled' | 'pending'; message?: string };

const QUERY_KEYS = {
  AVAILABLE_SHIFTS: ["available-shifts"],
  BOOKED_SHIFTS: ["booked-shifts"],
};

const invalidateShiftQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AVAILABLE_SHIFTS });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKED_SHIFTS });
};

const handleMutationError = (error: unknown, fallbackMessage: string, onError?: (message: string) => void) => {
  console.error("Mutation error:", error);
  
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data?.message;
    if (typeof errorMessage === "string") {
      onError?.(errorMessage);
      return;
    }
  }
  
  onError?.(fallbackMessage);
};

export const useClaimShift = (callbacks?: ClaimShiftCallbacks) => {
  const queryClient = useQueryClient();
  const { data: worker } = useCurrentWorker();

  return useMutation({
    mutationFn: async (shiftId: number): Promise<Shift> => {
      const response = await axios.post<{ data: Shift }>(`/api/shifts/${shiftId}/claim`, {
        workerId: worker?.id,
      });
      return response.data.data;
    },
    onSuccess: (claimedShift) => {
      invalidateShiftQueries(queryClient);
      callbacks?.onSuccess?.("Shift claimed successfully! Check your Booked Shifts.", claimedShift);
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const conflicts = error.response?.data?.conflicts;
        if (Array.isArray(conflicts) && conflicts.length > 0) {
          const conflictWindows = conflicts
            .map((conflict: { startAt: string; endAt: string }) => {
              const start = new Date(conflict.startAt);
              const end = new Date(conflict.endAt);
              const dateStr = format(start, "EEE, MMM d");
              return `${dateStr} · ${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
            })
            .join(", ");
          callbacks?.onError?.(`Cannot book shift due to time conflict with existing shifts: ${conflictWindows}`);
          return;
        }
      }
      
      handleMutationError(error, "Failed to claim shift. Please try again.", callbacks?.onError);
    },
  });
};

export const useCancelShift = (callbacks?: MutationCallbacks) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shiftId: number): Promise<CancelResult> => {
      const response = await axios.post<{ data: CancelResult }>(`/api/shifts/${shiftId}/cancel`);
      return response.data.data;
    },
    onSuccess: (data) => {
      invalidateShiftQueries(queryClient);
      if (data.status === 'pending') {
        callbacks?.onSuccess?.(data.message || "Cancellation request recorded. Please contact the manager.");
      } else {
        callbacks?.onSuccess?.("Shift cancelled successfully.");
      }
    },
    onError: (error: unknown) => {
      handleMutationError(error, "Failed to cancel shift. Please try again.", callbacks?.onError);
    },
  });
};

export const useKeepShift = (callbacks?: MutationCallbacks) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shiftId: number): Promise<Shift> => {
      const response = await axios.post<{ data: Shift }>(`/api/shifts/${shiftId}/keep`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKED_SHIFTS });
      callbacks?.onSuccess?.("Shift kept successfully.");
    },
    onError: (error: unknown) => {
      handleMutationError(error, "Failed to keep shift. Please try again.", callbacks?.onError);
    },
  });
};
