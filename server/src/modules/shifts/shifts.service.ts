import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Shift } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { getNextPage, queryParameters } from "../shared/pagination";
import { Page, PaginatedData } from "../shared/shared.types";
import { WorkplaceStatus } from "../workplaces/workplaces.schemas";
import { CreateShift, ShiftFilters } from "./shifts.schemas";

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService) { }

  private buildFilterWhere(filters?: ShiftFilters, isSearching = false): Prisma.ShiftWhereInput {
    const now = new Date();
    
    const startAtCondition: Prisma.DateTimeFilter = {
      gte: filters?.dateFrom || now,
    };
    
    if (filters?.dateTo) {
      startAtCondition.lte = new Date(filters.dateTo.getTime() + 86400000 - 1);
    }

    const workplaceCondition: Prisma.WorkplaceWhereInput = {
      status: WorkplaceStatus.ACTIVE,
    };
    
    if (filters?.location) {
      workplaceCondition.name = isSearching 
        ? { contains: filters.location }
        : filters.location;
    }

    const where: Prisma.ShiftWhereInput = {
      workerId: null,
      startAt: startAtCondition,
      workplace: { is: workplaceCondition },
    };

    if (filters?.jobType) {
      where.jobType = isSearching
        ? { contains: filters.jobType }
        : filters.jobType;
    }

    if (filters?.payRateMin !== undefined) {
      where.payRate = { gte: filters.payRateMin };
    }

    return where;
  }

  async create(data: CreateShift): Promise<Shift> {
    return await this.prisma.shift.create({
      data: data as Prisma.ShiftUncheckedCreateInput,
    });
  }

  async getAvailable(parameters: {
    page: Page;
    filters?: ShiftFilters
  }): Promise<PaginatedData<Shift>> {
    const { page, filters } = parameters;
    const filterWhere = this.buildFilterWhere(filters);
    const baseQuery = queryParameters({ page });

    const shifts = await this.prisma.shift.findMany({
      ...baseQuery,
      orderBy: { startAt: "asc" },
      where: {
        ...baseQuery.where,
        ...filterWhere,
      },
      include: { workplace: true },
    });

    const nextPage = shifts.length === page.size ? { ...page, num: page.num + 1 } : undefined;

    return {
      data: shifts,
      nextPage,
    };
  }

  async searchFilterOptions(
    type: 'locations' | 'jobTypes',
    searchTerm?: string,
    limit: number = 20,
    page: number = 0,
    filters?: ShiftFilters
  ): Promise<string[]> {
    const safeLimit = Math.max(1, Math.min(limit, 100));
    const safePage = Math.max(0, page);
    const skip = safePage * safeLimit;

    if (type === 'locations') {
      const locationFilters: ShiftFilters = searchTerm
        ? { ...filters, location: searchTerm }
        : filters || {};

      const baseWhere = this.buildFilterWhere(locationFilters, Boolean(searchTerm));

      const results = await this.prisma.shift.findMany({
        where: baseWhere,
        select: { workplace: { select: { name: true } } },
        distinct: ['workplaceId'],
        orderBy: { workplace: { name: 'asc' } },
        take: safeLimit,
        skip,
      });

      return results
        .map(r => r.workplace?.name)
        .filter((name): name is string => Boolean(name));

    } else {
      const jobTypeFilters: ShiftFilters = searchTerm
        ? { ...filters, jobType: searchTerm }
        : filters || {};

      const baseWhere = this.buildFilterWhere(jobTypeFilters, Boolean(searchTerm));

      const results = await this.prisma.shift.findMany({
        where: baseWhere,
        select: { jobType: true },
        distinct: ['jobType'],
        orderBy: { jobType: 'asc' },
        take: safeLimit,
        skip,
      });

      return results
        .map(r => r.jobType)
        .filter((jobType): jobType is string => Boolean(jobType));
    }
  }

  async getById(id: number): Promise<Shift | null> {
    return await this.prisma.shift.findUnique({
      where: { id },
      include: { workplace: true },
    });
  }

  async get(parameters: { page: Page }): Promise<PaginatedData<Shift>> {
    const { page } = parameters;

    const shifts = await this.prisma.shift.findMany({
      ...queryParameters({ page }),
      orderBy: { id: "asc" },
    });

    const nextPage = await getNextPage({
      currentPage: page,
      collection: this.prisma.shift,
    });

    return { data: shifts, nextPage };
  }

  async claim(id: number, workerId: number): Promise<Shift> {
    const shiftToClaim = await this.prisma.shift.findUnique({
      where: { id }
    });

    if (!shiftToClaim) {
      throw new NotFoundException("Shift not found");
    }

    const conflictingShifts = await this.prisma.shift.findMany({
      where: {
        workerId: workerId,
        cancelledAt: null,
        OR: [
          {
            AND: [
              { startAt: { lt: shiftToClaim.endAt } },
              { endAt: { gt: shiftToClaim.startAt } }
            ]
          }
        ]
      }
    });

    if (conflictingShifts.length > 0) {
      const conflictTimes = conflictingShifts
        .map(shift => `${shift.startAt.toISOString()} - ${shift.endAt.toISOString()}`)
        .join(', ');
      throw new ConflictException({
        message: `Cannot book shift due to time conflict with existing shifts: ${conflictTimes}`,
        conflicts: conflictingShifts.map((shift) => ({
          startAt: shift.startAt.toISOString(),
          endAt: shift.endAt.toISOString(),
        })),
      });
    }

    const result = await this.prisma.shift.updateMany({
      where: { id, workerId: null, workplace: { is: { status: WorkplaceStatus.ACTIVE } } },
      data: { workerId, cancelledAt: null },
    });

    if (result.count === 0) {
      throw new ConflictException("Shift is no longer available");
    }

    return await this.prisma.shift.findUniqueOrThrow({
      where: { id },
      include: { workplace: true },
    });
  }

  async cancel(id: number): Promise<{ shift: Shift; status: 'cancelled' | 'pending'; message?: string }> {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
      include: { worker: true, workplace: true }
    });

    if (!shift) {
      throw new NotFoundException("Shift not found");
    }

    const now = new Date();
    const hoursUntilShift = (shift.startAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isLastMinute = shift.minCancellationHours && hoursUntilShift < shift.minCancellationHours;

    if (isLastMinute) {
      const updatedShift = await this.prisma.shift.update({
        where: { id },
        data: { pendingCancellationAt: now },
        include: { worker: true, workplace: true }
      });

      const contactInfo = shift.contactPersonName
        ? `${shift.contactPersonName} at ${shift.contactPersonNumber || 'the provided number'}`
        : 'the manager';
      
      return { 
        shift: updatedShift, 
        status: 'pending', 
        message: `This shift is within ${shift.minCancellationHours} hours of start time. Please contact ${contactInfo} to discuss cancellation.`
      };
    }

    const cancelled = await this.prisma.shift.update({
      where: { id },
      data: { cancelledAt: now, workerId: null },
      include: { workplace: true },
    });

    return { shift: cancelled, status: 'cancelled' };
  }

  async keepShift(id: number) {
    const updatedShift = await this.prisma.shift.update({
      where: { id },
      data: { pendingCancellationAt: null },
      include: { workplace: true }
    });

    return updatedShift;
  }
}
