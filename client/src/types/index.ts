export interface Worker {
  id: number;
  name: string;
  status: number;
}

export interface Workplace {
  id: number;
  name: string;
  status: number;
  location?: string;
}

export interface Shift {
  id: number;
  createdAt: string;
  startAt: string;
  endAt: string;
  workplaceId: number;
  workerId: number | null;
  cancelledAt: string | null;
  pendingCancellationAt: string | null;
  minCancellationHours?: number;
  contactPersonName?: string;
  contactPersonNumber?: string;
  workplace: Workplace;
  jobType: string;
  payRate: number;

  status?: 'confirmed' | 'flagged' | 'cancelled_pending' | 'pending-cancellation' | 'pending' | 'completed';
  cancellationReason?: string;
  cancellationRequestedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: { next?: string };
  totalItems?: number;
}


export interface ShiftFilters {
  location?: string;
  jobType?: string;
  payRateMin?: number;
  dateFrom?: string;
  dateTo?: string;
}

export type ShiftStatus = 'available' | 'booked' | 'cancelled' | 'completed';

export interface BookingResult {
  success: boolean;
  message: string;
  shift?: Shift;
}