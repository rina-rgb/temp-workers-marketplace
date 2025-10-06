import { Shift, Workplace } from "@prisma/client";
import { PaginatedResponse, Response } from "src/modules/shared/shared.types";
import { ShiftDTO } from "src/modules/shifts/shifts.schemas";
import { WorkplaceStatus } from "src/modules/workplaces/workplaces.schemas";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3000";

type ShiftCountMap = Record<number, number>;

const isShiftCompleted = (
  shift: Pick<Shift, "workerId" | "cancelledAt" | "endAt">,
): boolean =>
  shift.workerId != null &&
  shift.cancelledAt == null &&
  new Date(shift.endAt) < new Date();

const fetchJSONFromUrl = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} error; HTTP ${res.status}`);
  return res.json() as Promise<T>;
};

const getWorkplaceUrl = (id: number) => `${API_BASE}/workplaces/${id}`;


const countCompletedShiftsByWorkplace = async (): Promise<ShiftCountMap> => {
  let nextPageUrl: string | null = `${API_BASE}/shifts`;
  const workPlaceShiftCounts: ShiftCountMap = {};

  while (nextPageUrl) {
    const page: PaginatedResponse<ShiftDTO> = await fetchJSONFromUrl<PaginatedResponse<ShiftDTO>>(nextPageUrl);
    for (const shift of page.data) {
      if (isShiftCompleted(shift)) {
        const wid = (shift).workplaceId as number;
        workPlaceShiftCounts[wid] = (workPlaceShiftCounts[wid] ?? 0) + 1;
      }
    }
    nextPageUrl = page.links?.next ?? null;
  }
  return workPlaceShiftCounts;
};

const fetchActiveWorkplace = async (id: number) => {
  const data = await fetchJSONFromUrl<Response<Workplace>>(getWorkplaceUrl(id));
  return data.data?.status === WorkplaceStatus.ACTIVE ? data.data : null;
};

const getTopWorkplaces = async (limit: number = 3) => {
  try {
    const counts = await countCompletedShiftsByWorkplace();
    const orderedIds = Object.keys(counts)
      .map(Number)
      .sort((a, b) => (counts[b] - counts[a]) || (a - b));

    const result: Array<{ name: string; shifts: number }> = [];

    for (const id of orderedIds) {
      const wp = await fetchActiveWorkplace(id);
      if (!wp) continue;

      result.push({ name: wp.name, shifts: counts[id] });

      if (result.length >= limit) break;
    }

    result.sort((a, b) => (b.shifts - a.shifts) || a.name.localeCompare(b.name));

    console.log(result);
  } catch (err) {
    console.error("Error loading workplaces:", err);
    throw err;
  }
};

getTopWorkplaces();
