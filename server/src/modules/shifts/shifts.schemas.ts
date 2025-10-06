import { Shift } from "@prisma/client";
import { z } from "zod";

import { MAX_SHARDS } from "../shared/constants";

export const createShiftSchema = z.object({
  startAt: z.string(),
  endAt: z.string(),
  workerId: z.number().optional(),
  workplaceId: z.number(),
  shard: z.number().int().min(0).max(MAX_SHARDS).optional(),
});

export type CreateShift = z.infer<typeof createShiftSchema>;

export type ShiftDTO = Omit<Shift, "shard">;

export interface ShiftFilters {
  location?: string;
  jobType?: string;
  payRateMin?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SearchFilterOptionsDto {
  type: 'locations' | 'jobTypes';
  search?: string;
  limit?: string;
  page?: string;
  location?: string;
  jobtype?: string;
  payratemin?: string;
  datefrom?: string;
  dateto?: string;
}
