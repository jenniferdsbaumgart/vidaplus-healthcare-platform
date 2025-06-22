import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword1 = await bcrypt.hash("password123", 10);
  const hashedPassword2 = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "dr.ana@vidaplus.com" },
    update: {},
    create: {
      name: "Dr. Ana Beatriz Santos",
      email: "dr.ana@vidaplus.com",
      password: hashedPassword1,
      avatar:
        "https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@vidaplus.com" },
    update: {},
    create: {
      name: "Admin João",
      email: "admin@vidaplus.com",
      password: hashedPassword2,
      avatar: "/admin-user.png",
    },
  });

  // Inserção de pacientes
  await prisma.patient.createMany({
    data: [
      {
        full_name: "Maria Silva",
        cpf: "123.456.789-00",
        birth_date: new Date("1985-03-15"),
        gender: "female",
        email: "maria.silva@email.com",
        phone: "(11) 91234-5678",
        address: "Rua das Flores, 123, São Paulo, SP",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        full_name: "João Souza",
        cpf: "987.654.321-00",
        birth_date: new Date("1990-07-22"),
        gender: "male",
        email: "joao.souza@email.com",
        phone: "(21) 99876-5432",
        address: "Av. Brasil, 456, Rio de Janeiro, RJ",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
    ],
  });

  // Inserção de staff
  await prisma.staff.createMany({
    data: [
      {
        full_name: "Dr. Ana Pereira",
        registration_number: "CRM12345",
        role: "doctor",
        email: "ana.pereira@hospital.com",
        phone: "(11) 91234-0000",
        specialization: "Cardiology",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      },
      {
        full_name: "Enf. Carlos Mendes",
        registration_number: "COREN54321",
        role: "nurse",
        email: "carlos.mendes@hospital.com",
        phone: "(11) 91234-1111",
        specialization: null,
        avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      },
    ],
  });

  await prisma.staff.create({
    data: {
      full_name: "Téc. Paula Oliveira",
      registration_number: "TECH9876",
      role: "technician",
      email: "paula.oliveira@hospital.com",
      phone: "(11) 91234-2222",
      specialization: "Radiology",
      avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    },
  });

  // Inserção de medicamentos
  await prisma.medication.createMany({
    data: [
      { name: "Dipirona", dosage: "500mg" },
      { name: "Losartana", dosage: "50mg" },
    ],
  });

  // Buscar pacientes e medicamentos para criar relacionamento
  const maria = await prisma.patient.findFirst({
    where: { cpf: "123.456.789-00" },
  });
  const joao = await prisma.patient.findFirst({
    where: { cpf: "987.654.321-00" },
  });

  const dipirona = await prisma.medication.findFirst({
    where: { name: "Dipirona" },
  });
  const losartana = await prisma.medication.findFirst({
    where: { name: "Losartana" },
  });

  if (maria && dipirona) {
    await prisma.patientMedication.create({
      data: {
        patient_id: maria.id,
        medication_id: dipirona.id,
      },
    });
  }

  if (joao && losartana) {
    await prisma.patientMedication.create({
      data: {
        patient_id: joao.id,
        medication_id: losartana.id,
      },
    });
  }

  // Inserção de alergias
  if (maria) {
    await prisma.allergy.create({
      data: {
        patient_id: maria.id,
        allergy: "Penicillin",
      },
    });
  }
  if (joao) {
    await prisma.allergy.create({
      data: {
        patient_id: joao.id,
        allergy: "Latex",
      },
    });
  }

  // Inserção de condições crônicas
  if (maria) {
    await prisma.chronicCondition.create({
      data: {
        patient_id: maria.id,
        condition: "Diabetes",
      },
    });
  }
  if (joao) {
    await prisma.chronicCondition.create({
      data: {
        patient_id: joao.id,
        condition: "Hypertension",
      },
    });
  }

  // Inserção de exames
  if (maria) {
    await prisma.exam.create({
      data: {
        patient_id: maria.id,
        name: "Blood Test",
        date: new Date("2023-02-10"),
        result: "Normal",
      },
    });
  }
  if (joao) {
    await prisma.exam.create({
      data: {
        patient_id: joao.id,
        name: "ECG",
        date: new Date("2023-03-15"),
        result: "Altered",
      },
    });
  }

  // Inserção de agendamentos
  const drAna = await prisma.staff.findFirst({
    where: { registration_number: "CRM12345" },
  });

  if (maria && drAna) {
    await prisma.appointment.create({
      data: {
        patient_id: maria.id,
        date: new Date("2023-06-15"),
        time: "09:00:00",
        doctor_id: drAna.id,
        doctor_name: drAna.full_name,
        type: "Consultation",
        status: "Scheduled",
      },
    });
  }
  if (joao && drAna) {
    await prisma.appointment.create({
      data: {
        patient_id: joao.id,
        date: new Date("2023-06-16"),
        time: "14:00:00",
        doctor_id: drAna.id,
        doctor_name: drAna.full_name,
        type: "Follow-up",
        status: "Completed",
      },
    });
  }

  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
