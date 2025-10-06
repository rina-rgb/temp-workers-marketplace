import { Prisma } from "@prisma/client";

function generateWorkplaces(): Prisma.WorkplaceCreateInput[] {
  const companies = [
    "Moon Studies Software", "Radiant Power Inc", "Dust Power LLC", "Sun Phosphate Software",
    "Phobos Studies", "Orbit Research Labs", "Galactic Mining Corp", "Lunar Base Network",
    "Starlight Energy Solutions", "Quantum Analytics", "Deep Space Technologies", "Neptune Navigation Ltd",
    "Cosmic Construction Co.", "Saturn Systems", "Jupiter Networks", "Venus Ventures",
    "Mercury Materials", "Earth Ecology Enterprises", "Pluto Properties", "Asteroid Mining Corp",
    "Solar Panel Systems", "Space Transport Ltd", "Nebula Technologies", "Galaxy Communications",
    "Interstellar Logistics", "Cosmic Energy Co", "Stellar Manufacturing", "Planetary Resources",
    "Space Station Alpha", "Orbital Mechanics Inc", "Rocket Fuel Solutions", "Zero-G Industries",
    "Martian Agriculture", "Space Habitat Corp", "Cosmic Defense Systems", "Stellar Navigation",
    "Galaxy Mining Operations", "Space Cargo Services", "Lunar Transportation", "Asteroid Research",
    "Cosmic Materials Lab", "Space Engineering Works", "Stellar Power Generation", "Galaxy Maintenance",
    "Interplanetary Communications", "Space Recycling Corp", "Cosmic Food Systems", "Stellar Security",
    "Galaxy Medical Center", "Space Tourism Inc"
  ];

  const workplaces: Prisma.WorkplaceCreateInput[] = [];
  
  for (let i = 0; i < 10000; i++) {
    const baseCompany = companies[i % companies.length];
    const suffix = Math.floor(i / companies.length);
    const name = suffix > 0 ? `${baseCompany} ${suffix + 1}` : baseCompany;
    
    workplaces.push({
      name,
      status: i % 10 === 0 ? 1 : (i % 15 === 0 ? 2 : 0),
    });
  }
  
  return workplaces;
}

export const workplaces: Prisma.WorkplaceCreateInput[] = generateWorkplaces();