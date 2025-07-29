// prisma/seeding/seed-from-remote.ts
import { Prisma, PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Carga la URL remota
dotenv.config({ path: path.resolve(__dirname, '../../.env.production') });
const remotePrisma = new PrismaClient({
  datasources: { db: { url: process.env.REMOTE_DATABASE_URL } },
});

// Carga la URL local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const localPrisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const seedUsers = async () => {
  const users = await remotePrisma.user.findMany();
  for (const user of users) {
    await localPrisma.user.create({ data: user });
  }
};

const seedGroups = async () => {
  const groups = await remotePrisma.group.findMany();
  for (const group of groups) {
    await localPrisma.group.create({ data: group });
  }
};

const seedGroupMembers = async () => {
  const groupMembers = await remotePrisma.groupMember.findMany();
  for (const groupMember of groupMembers) {
    await localPrisma.groupMember.create({ data: groupMember });
  }
};

const seedGroupInvitations = async () => {
  const groupInvitations = await remotePrisma.groupInvitation.findMany();
  for (const groupInvitation of groupInvitations) {
    await localPrisma.groupInvitation.create({ data: groupInvitation });
  }
};

const seedGroupCategories = async () => {
  const groupCategories = await remotePrisma.groupCategories.findMany();
  for (const groupCategory of groupCategories) {
    await localPrisma.groupCategories.create({ data: groupCategory });
  }
};

const seedExpenses = async () => {
  const expenses = await remotePrisma.expense.findMany();
  for (const expense of expenses) {
    await localPrisma.expense.create({ data: expense });
  }
};

const seedExpeseCategories = async () => {
  const expeseCategories = await remotePrisma.expenseCategory.findMany();
  for (const expeseCategory of expeseCategories) {
    await localPrisma.expenseCategory.create({ data: expeseCategory });
  }
};

const seedNotifications = async () => {
  const notifications = await remotePrisma.notification.findMany();
  for (const notification of notifications) {
    const { ...rest } = notification;
    await localPrisma.notification.create({
      data: {
        ...rest,
        metadata: rest.metadata === null ? Prisma.JsonNull : rest.metadata,
      },
    });
  }
};

const seedDebt = async () => {
  const debts = await remotePrisma.debt.findMany();
  for (const debt of debts) {
    await localPrisma.debt.create({ data: debt });
  }
};

const seedPaymentDebts = async () => {
  const debtPayments = await remotePrisma.paymentDebt.findMany();
  for (const debtPayment of debtPayments) {
    await localPrisma.paymentDebt.create({ data: debtPayment });
  }
};

const seedBalances = async () => {
  const balances = await remotePrisma.balance.findMany();
  for (const balance of balances) {
    await localPrisma.balance.create({ data: balance });
  }
};

const seedExpenseShares = async () => {
  const expenseShares = await remotePrisma.expenseShare.findMany();
  for (const expenseShare of expenseShares) {
    await localPrisma.expenseShare.create({ data: expenseShare });
  }
};

const seedGroupToGroupCategories = async () => {
  const entries = await remotePrisma.$queryRaw<
    { A: string; B: string }[]
  >`SELECT * FROM "_GroupCategories"`;

  console.log(entries);

  for (const entry of entries) {
    await localPrisma.$executeRaw`
        INSERT INTO "_GroupCategories" ("A", "B")
        VALUES (${entry.A}, ${entry.B})
        ON CONFLICT DO NOTHING
      `;
  }
};

const seedAll = async () => {
  await seedUsers();
  await seedGroups();
  await seedGroupMembers();
  await seedGroupToGroupCategories();
  await seedGroupInvitations();
  await seedGroupCategories();
  await seedExpenses();
  await seedExpeseCategories();
  await seedNotifications();
  await seedDebt();
  await seedPaymentDebts();
  await seedBalances();
  await seedExpenseShares();
};

const queryAll = async () => {
  const usersLocal = await localPrisma.user.findMany();
  console.log('users local \n', usersLocal);

  const groupsLocal = await localPrisma.group.findMany();
  console.log('groups local \n', groupsLocal);

  const groupMembersLocal = await localPrisma.groupMember.findMany();
  console.log('group members local \n', groupMembersLocal);

  const groupInvitationsLocal = await localPrisma.groupInvitation.findMany();
  console.log('group invitations local \n', groupInvitationsLocal);

  const groupCategoriesLocal = await localPrisma.groupCategories.findMany();
  console.log('group categories local \n', groupCategoriesLocal);

  const expensesLocal = await localPrisma.expense.findMany();
  console.log('expenses local \n', expensesLocal);

  const expeseCategoriesLocal = await localPrisma.expenseCategory.findMany();
  console.log('expese categories local \n', expeseCategoriesLocal);

  const notificationsLocal = await localPrisma.notification.findMany();
  console.log('notifications local \n', notificationsLocal);

  const debtsLocal = await localPrisma.debt.findMany();
  console.log('debts local \n', debtsLocal);

  const paymentDebtsLocal = await localPrisma.paymentDebt.findMany();
  console.log('payment debts local \n', paymentDebtsLocal);

  const balancesLocal = await localPrisma.balance.findMany();
  console.log('balances local \n', balancesLocal);

  const expenseSharesLocal = await localPrisma.expenseShare.findMany();
  console.log('expense shares local \n', expenseSharesLocal);
};

async function main() {
  await seedAll();
  await queryAll();
}

main()
  .then(() => {
    console.log('Migración completa');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await remotePrisma.$disconnect();
    await localPrisma.$disconnect();
  });
