const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Arjun',
      university: 'Shoolini University',
      year: '2nd Year',
      department: 'Computer Science',
    },
  });
  console.log('Seeded User:', user);
  
  // Seed some initial attendance logs
  await prisma.attendanceLog.create({
    data: {
      userId: user.id,
      subjectName: 'Physics 101',
      status: 'Attended',
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
