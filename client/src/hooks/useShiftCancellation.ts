import { useCallback, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Shift } from "../types";
import { useCancelShift, useKeepShift } from "./useShiftMutations";

type Options = {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export function useShiftCancellation(opts?: Options) {
  const queryClient = useQueryClient();

  const [modalShift, setModalShift] = useState<Shift | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const cancel = useCancelShift();
  const keep = useKeepShift();

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["booked-shifts"] });
    queryClient.invalidateQueries({ queryKey: ["available-shifts"] });
  }, [queryClient]);

  const cancellationFlow = useMutation({
    mutationFn: async (params: { shift: Shift; reason?: string }) => {
      const { shift } = params;
      setBusyId(shift.id);

      if (shift.pendingCancellationAt) {
        const kept = await keep.mutateAsync(shift.id);
        return { kind: 'kept' as const, shift: kept };
      }

      const result = await cancel.mutateAsync(shift.id);
      return { kind: 'cancel' as const, result };
    },
    onSuccess: (data) => {
      let msg: string;
      if (data.kind === 'kept') {
        msg = "You kept this shift. Your previous cancellation request was withdrawn.";
      } else {
        msg = data.result.status === 'pending'
          ? (data.result.message || "Cancellation request sent. Please contact the manager.")
          : "Shift canceled.";
      }

      invalidateAll();
      opts?.onSuccess?.(msg);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      opts?.onError?.(msg);
    },
    onSettled: () => {
      setBusyId(null);
      setModalShift(null);
    },
  });

  const start = useCallback(
    (shift: Shift) => {
      if (shift.pendingCancellationAt) {
        cancellationFlow.mutate({ shift });
      } else {
        setModalShift(shift);
      }
    },
    [cancellationFlow]
  );

  const confirm = useCallback(
    (reason?: string) => {
      if (!modalShift) return;
      cancellationFlow.mutate({ shift: modalShift, reason });
    },
    [cancellationFlow, modalShift]
  );

  const close = useCallback(() => setModalShift(null), []);
  const isLoading = useMemo(() => cancellationFlow.isPending, [cancellationFlow.isPending]);

  return {
    modalShift,
    busyId,
    isLoading,
    start,
    confirm,
    close,
  };
}
