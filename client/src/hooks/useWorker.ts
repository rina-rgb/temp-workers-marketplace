import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Worker } from "../types";

const CURRENT_WORKER_ID = 1;

export const useCurrentWorker = () => {
  return useQuery({
    queryKey: ["worker", CURRENT_WORKER_ID],
    queryFn: async (): Promise<Worker> => {
      const response = await axios.get<{ data: Worker }>(`/api/workers/${CURRENT_WORKER_ID}`);
      return response.data.data;
    },
  });
};