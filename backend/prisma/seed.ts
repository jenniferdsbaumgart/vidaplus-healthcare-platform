import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/pt_BR";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️ Limpando banco...");
  await prisma.teleconsultation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.allergy.deleteMany();
  await prisma.chronicCondition.deleteMany();
  await prisma.patientMedication.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.staff.deleteMany();

  const specialities = [
    "Clínica Geral",
    "Pediatria",
    "Cardiologia",
    "Ortopedia",
    "Psiquiatria",
    "Ginecologia",
  ];

  const examNames = [
    "Hemograma completo",
    "ECG",
    "Raio-X de tórax",
    "Ultrassonografia abdominal",
    "Tomografia computadorizada",
    "Ressonância magnética",
    "Glicemia de jejum",
    "Colesterol total",
    "Triglicerídeos",
    "TSH",
    "Ureia e creatinina",
  ];

  const allergies = [
    "Penicilina",
    "Látex",
    "Dipirona",
    "Ibuprofeno",
    "Amendoim",
    "Frutos do mar",
  ];

  const chronicConditions = [
    "Diabetes",
    "Hipertensão",
    "Asma",
    "Epilepsia",
    "Depressão",
    "Ansiedade",
    "Artrite",
  ];

  console.log("👨‍⚕️ Criando médicos...");
  const doctors: Awaited<ReturnType<typeof prisma.staff.create>>[] = [];
  for (let i = 0; i < 10; i++) {
    const speciality = faker.helpers.arrayElement(specialities);
    const doctor = await prisma.staff.create({
      data: {
        full_name: `Dr(a). ${faker.person.fullName()}`,
        registration_number: `CRM${faker.number.int({ min: 10000, max: 99999 })}`,
        role: "doctor",
        email: faker.internet.email(),
        phone: faker.phone.number({ style: "national" }),
        specialization: speciality,
        avatar: faker.image.urlPicsumPhotos(),
      },
    });
    doctors.push(doctor);
  }
  console.log("🧑‍🤝‍🧑 Criando pacientes...");
  const patients: Awaited<ReturnType<typeof prisma.patient.create>>[] = [];
  for (let i = 0; i < 20; i++) {
    const patient = await prisma.patient.create({
      data: {
        full_name: faker.person.fullName(),
        cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
        birth_date: faker.date.birthdate(),
        gender: faker.helpers.arrayElement(["male", "female"]),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: "national" }),
        address: faker.location.streetAddress({ useFullAddress: true }),
        avatar: faker.image.avatar(),
      },
    });
    patients.push(patient);
  }
  console.log("💊 Criando medicamentos...");
  const medicationNames = ["Dipirona", "Losartana", "Amoxicilina", "Ibuprofeno", "Omeprazol", "Sinvastatina", "Sertralina", "Fluoxetina"];
  const medications: Awaited<ReturnType<typeof prisma.medication.create>>[] = [];
  for (const name of medicationNames) {
    const med = await prisma.medication.create({
      data: { name, dosage: `${faker.number.int({ min: 10, max: 500 })}mg` },
    });
    medications.push(med);
  }
  console.log("💊 Relacionando medicamentos...");
  for (const patient of patients) {
    const numMeds = faker.number.int({ min: 1, max: 3 });
    const meds = faker.helpers.arrayElements(medications, numMeds);
    for (const med of meds) {
      await prisma.patientMedication.create({
        data: { patient_id: patient.id, medication_id: med.id },
      });
    }
  }

  console.log("⚠️ Inserindo alergias...");
  for (const patient of patients) {
    const numAllergies = faker.number.int({ min: 1, max: 3 });
    const selected = faker.helpers.arrayElements(allergies, numAllergies);
    for (const allergy of selected) {
      await prisma.allergy.create({
        data: { patient_id: patient.id, allergy },
      });
    }
  }

  console.log("⚠️ Inserindo condições crônicas...");
  for (const patient of patients) {
    const numConditions = faker.number.int({ min: 1, max: 2 });
    const selected = faker.helpers.arrayElements(chronicConditions, numConditions);
    for (const condition of selected) {
      await prisma.chronicCondition.create({
        data: { patient_id: patient.id, condition },
      });
    }
  }

  console.log("🔬 Criando exames...");
  for (const patient of patients) {
    const numExams = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numExams; i++) {
      await prisma.exam.create({
        data: {
          patient_id: patient.id,
          name: faker.helpers.arrayElement(examNames),
          date: faker.date.recent(),
          result: faker.helpers.arrayElement(["Normal", "Alterado"]),
        },
      });
    }
  }

  console.log("📅 Criando consultas...");
  const statusOptions = ["Agendado", "Concluído", "Cancelado", "Pendente"];
  const typeOptions = ["Consulta Presencial", "Teleconsulta"];

  for (let i = 0; i < 15; i++) {
    const patient = faker.helpers.arrayElement(patients);
    const doctor = faker.helpers.arrayElement(doctors);
    const type = faker.helpers.arrayElement(typeOptions);
    const status = faker.helpers.arrayElement(statusOptions);

    await prisma.appointment.create({
      data: {
        patient_id: patient.id,
        date: faker.date.soon(),
        time: `${faker.number.int({ min: 8, max: 17 })}:00:00`,
        doctor_id: doctor.id,
        doctor_name: doctor.full_name,
        type,
        status,
      },
    });

    if (type === "Teleconsulta") {
      await prisma.teleconsultation.create({
        data: {
          patient_id: patient.id,
          doctor_id: doctor.id,
          date: faker.date.soon(),
          notes: faker.lorem.sentence(),
        },
      });
    }
  }

  console.log("✅ Seed populado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
