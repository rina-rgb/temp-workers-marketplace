import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UsePipes,
} from "@nestjs/common";
import { Request } from "express";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { nextLink, omitShard, PaginationPage } from "../shared/pagination";
import {
  type Page,
  PaginatedResponse,
  type Response,
} from "../shared/shared.types";
import {
  type CreateShift,
  createShiftSchema,
  SearchFilterOptionsDto,
  ShiftDTO,
} from "./shifts.schemas";
import { ShiftsService } from "./shifts.service";
import { parseShiftFilters } from "./shifts.utils";

@Controller("shifts")
export class ShiftsController {
  constructor(private readonly service: ShiftsService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(createShiftSchema))
  async create(@Body() data: CreateShift): Promise<Response<ShiftDTO>> {
    return { data: omitShard(await this.service.create(data)) };
  }

  @Get("/available")
  async getAvailable(
    @Req() request: Request,
    @PaginationPage() page: Page,
    @Query("location") location?: string,
    @Query("jobtype") jobType?: string,
    @Query("payratemin") payRateMin?: string,
    @Query("datefrom") dateFrom?: string,
    @Query("dateto") dateTo?: string,
  ): Promise<PaginatedResponse<ShiftDTO>> {
    const filters = parseShiftFilters({ location, jobtype: jobType, payratemin: payRateMin, datefrom: dateFrom, dateto: dateTo });

    const { data, nextPage } = await this.service.getAvailable({
      page,
      filters
    });

    return {
      data: data.map(omitShard),
      links: { next: nextLink({ nextPage, request }) },
    };
  }

  @Get("/filter-options/search")
  async searchFilterOptions(@Query() query: SearchFilterOptionsDto): Promise<string[]> {
    const limitNum = query.limit ? parseInt(query.limit, 10) : 20;
    const pageNum = query.page ? parseInt(query.page, 10) : 0;
    const filters = parseShiftFilters({ 
      location: query.location, 
      jobtype: query.jobtype, 
      payratemin: query.payratemin, 
      datefrom: query.datefrom, 
      dateto: query.dateto 
    });

    return await this.service.searchFilterOptions(
      query.type,
      query.search,
      limitNum,
      pageNum,
      filters
    );
  }

  @Get("/:id")
  async getById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Response<ShiftDTO>> {
    const data = await this.service.getById(id);
    if (!data) {
      throw new Error(`ID ${id} not found.`);
    }

    return { data: omitShard(data) };
  }

  @Get()
  async get(
    @Req() request: Request,
    @PaginationPage() page: Page,
  ): Promise<PaginatedResponse<ShiftDTO>> {
    const { data, nextPage } = await this.service.get({ page });

    return {
      data: data.map(omitShard),
      links: { next: nextLink({ nextPage, request }) },
    };
  }


  @Post("/:id/claim")
  async claim(
    @Param("id", ParseIntPipe) id: number,
    @Body("workerId", ParseIntPipe) workerId: number,
  ): Promise<Response<ShiftDTO>> {
    return { data: omitShard(await this.service.claim(id, workerId)) };
  }

  @Post("/:id/cancel")
  async cancel(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Response<{ shift: ShiftDTO; status: 'cancelled' | 'pending'; message?: string }>> {
    const result = await this.service.cancel(id);
    return {
      data: {
        shift: omitShard(result.shift),
        status: result.status,
        ...(result.message ? { message: result.message } : {}),
      }
    };
  }

  @Post("/:id/keep")
  async keepShift(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Response<ShiftDTO>> {
    return { data: omitShard(await this.service.keepShift(id)) };
  }
}