import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient, UserStatus } from '@prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean old data
  console.log('🧹 Cleaning database table...');

  await prisma.sessions.deleteMany();
  await prisma.users.deleteMany();

  console.log('✅ Old data removed successfully.');

  // Creates a hashed password
  const standardPassword = 'Admin@123';
  const hashedPassword = await bcrypt.hash(standardPassword, 10);

  // Creates the users
  const users = await Promise.all([
    prisma.users.create({
      data: {
        first_name: 'System',
        last_name: 'Admin',
        email: 'admin@company.com',
        password: hashedPassword,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.users.create({
      data: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@gmail.com',
        password: hashedPassword,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.users.create({
      data: {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@gmail.com',
        password: hashedPassword,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.users.create({
      data: {
        first_name: 'Susan',
        last_name: 'Doe',
        email: 'susan.doe@gmail.com',
        password: hashedPassword,
        status: UserStatus.INACTIVE,
      },
    }),
  ]);

  console.log('✅ Users created:', users.length);

  console.log('\n🎉 Seed completed successfully!');
  console.log(`\n📊 Overview:`);
  console.log(`   - ${users.length} users`);
  console.log(`\n🔑 Standard Passwod: ${standardPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Error trying to execute seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
