import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/pt_BR";

const prisma = new PrismaClient();

async function main() {
  console.log("🧑‍⚕️ Criando staffs não médicos...");

  // Funções de staff não médicos
  type Role = "nurse" | "technician";
  const roles: Role[] = ["nurse", "technician"];

  for (let i = 0; i < 10; i++) {
    const role = faker.helpers.arrayElement(roles);
    await prisma.staff.create({
      data: {
        full_name: faker.person.fullName(),
        role: role,
        registration_number: faker.string.alphanumeric(8),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: "national" }),
        specialization: role === "nurse" ? "Enfermagem" : "Técnico em Radiologia",
        avatar: faker.image.avatar(),
      },
    });
  }

  console.log("✅ Staffs não médicos criados com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed de staff não médicos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
