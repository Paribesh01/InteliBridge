import prisma from "../src";

async function main() {
    await prisma.availableTrigger.create({
        data:{
            name:"github",
            image:"fadfas"
        }
    })
    await prisma.availableWorkflow.create({
        data:{
            name:"github",
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