import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.availableTrigger.create({
        data:{
            name:"email",
            image:"fadfas"
        }
    })

    await prisma.availableWorkflow.create({
        data:{
            name:"email",
            image:"fadfasf",
        }
    })

    


 

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
