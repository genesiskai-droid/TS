import { PrismaClient, $Enums } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type UserRole = $Enums.Role;

interface SeedUser {
  email: string;
  role: UserRole;
}

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const users: SeedUser[] = [
    {
      email: 'admin@test.com',
      role: 'ADMIN',
    },
    {
      email: 'manager@test.com',
      role: 'MANAGER',
    },
    {
      email: 'tecnico@test.com',
      role: 'TECNICO',
    },
    {
      email: 'recepcion@test.com',
      role: 'RECEPCION',
    },
    {
      email: 'cliente@test.com',
      role: 'CLIENTE',
    },
    {
      email: 'sos@test.com',
      role: 'SOS',
    },
  ];

  for (const user of users) {
    const exists = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!exists) {
      await prisma.user.create({
        data: {
          email: user.email,
          password,
          role: user.role,
        },
      });

      console.log(`✔ Usuario creado: ${user.email}`);
    } else {
      console.log(`↪ Usuario ya existe: ${user.email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
