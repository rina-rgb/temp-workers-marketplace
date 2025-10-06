import { Prisma } from "@prisma/client";

function generateShifts(): Prisma.ShiftCreateInput[] {
  const jobTypes = [
    "Certified Oxygen Systems Technician",
    "Food Service Assistant",
    "Sanitation Specialist",
    "Atmospheric Maintenance Tech",
    "Security Officer",
    "Communications Specialist",
    "Equipment Maintenance",
    "Data Analyst"
  ];

  const contactPersons = [
    { name: "Sarah Chen", number: "+1-555-0101" },
    { name: "Marcus Rodriguez", number: "+1-555-0102" },
    { name: "Kim Park", number: "+1-555-0103" },
    { name: "Alex Johnson", number: "+1-555-0104" },
    { name: "Maya Patel", number: "+1-555-0105" }
  ];

  const shifts: Prisma.ShiftCreateInput[] = [];

  for (let i = 0; i < 20000; i++) {
    const startDate = new Date("2025-09-23");
    startDate.setDate(startDate.getDate() + Math.floor(i / 3));


    const hourOffset = i % 16;
    const isHalfHour = Math.random() < 0.5;
    startDate.setHours(6 + hourOffset, isHalfHour ? 30 : 0, 0, 0);

    const endDate = new Date(startDate);
    const shiftDurationHours = 4 + Math.floor(Math.random() * 6);
    const shiftDurationMinutes = Math.random() < 0.5 ? 0 : 30;
    endDate.setHours(startDate.getHours() + shiftDurationHours, shiftDurationMinutes, 0, 0);

    const jobType = jobTypes[i % jobTypes.length];
    const contact = contactPersons[i % contactPersons.length];
    const workplaceId = (i % 10000) + 1;
    const workerId = Math.random() < 0.3 ? (i % 20) + 1 : null;

    shifts.push({
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
      jobType,
      payRate: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50][Math.floor(Math.random() * 15)],
      minCancellationHours: Math.random() < 0.8 ? [2, 4, 8, 12, 24, 48][Math.floor(Math.random() * 6)] : null,
      contactPersonName: contact.name,
      contactPersonNumber: contact.number,
      workplace: { connect: { id: workplaceId } },
      ...(workerId && { worker: { connect: { id: workerId } } })
    });
  }

  return shifts;
}

export const shifts: Prisma.ShiftCreateInput[] = generateShifts();