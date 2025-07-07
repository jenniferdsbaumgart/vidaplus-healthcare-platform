import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Verificando Dr(a). Ana Beatriz Santos...");

  let doctor = await prisma.staff.findFirst({
    where: { full_name: { contains: "Ana Beatriz Santos" } },
  });

  if (!doctor) {
    console.log("👩‍⚕️ Não encontrada em staff, criando...");

    const user = await prisma.user.findFirst({
      where: { email: "dr.ana@vidaplus.com" },
    });

    if (!user) {
      console.log("❌ User dr.ana@vidaplus.com não encontrado. Crie-o antes.");
      return;
    }

    doctor = await prisma.staff.create({
      data: {
        full_name: "Dr(a). Ana Beatriz Santos",
        registration_number: "CRM12345",
        specialization: "Clínica Geral",
        role: "doctor",
        email: user.email,
        phone: "11999998888",
        avatar: "https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=150",
        user: { connect: { id: user.id } },
      },
    });

    console.log(`✅ Staff criado: ${doctor.full_name} (ID: ${doctor.id})`);
  } else {
    console.log(`✅ Staff já existe: ${doctor.full_name} (ID: ${doctor.id})`);
  }

  const patient = await prisma.patient.findFirst();
  if (!patient) {
    console.log("❌ Nenhum paciente encontrado no banco.");
    return;
  }

  console.log(`👤 Paciente encontrado: ${patient.full_name} (ID: ${patient.id})`);

  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    date.setHours(9 + i, 0, 0, 0);

    const type = i % 2 === 0 ? "Consulta Presencial" : "Teleconsulta";

    const appointment = await prisma.appointment.create({
      data: {
        date,
        time: date.toTimeString().slice(0,5),
        doctor_id: doctor.id,
        doctor_name: doctor.full_name,
        patient_id: patient.id,
        type,
        status: "Agendado",
      },
    });

    console.log(`📅 Appointment criado: ${type} em ${appointment.date}`);

    if (type === "Teleconsulta") {
      const tele = await prisma.teleconsultation.create({
        data: {
          date,
          notes: "Consulta agendada via seed script",
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
        },
      });
      console.log(`💻 Teleconsulta criada: ${tele.id} em ${tele.date}`);
    }
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
