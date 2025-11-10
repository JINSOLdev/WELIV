import {
  PrismaClient,
  UserRole,
  ApartmentStatus,
  JoinStatus,
  ComplaintStatus,
} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // SUPER ADMIN
  const superAdmin = await prisma.user.create({
    data: {
      name: '최고관리자',
      email: 'super@admin.com',
      passwordHash: 'hashed_pw_super',
      role: UserRole.SUPER_ADMIN,
    },
  });

  // ADMIN
  const admin = await prisma.user.create({
    data: {
      name: '관리자 김철수',
      email: 'admin@weliv.com',
      passwordHash: 'hashed_pw_admin',
      role: UserRole.ADMIN,
    },
  });

  // Apartment
  const apartment = await prisma.apartment.create({
    data: {
      name: '위리브 아파트',
      address: '서울 강남구 어디로 123',
      description: '신축 아파트입니다.',
      apartmentStatus: ApartmentStatus.ACTIVE,
      adminId: admin.id,
    },
  });

  // Resident 1 > 가입 승인
  const residentUser1 = await prisma.user.create({
    data: {
      name: '홍길동',
      email: 'hong@weliv.com',
      passwordHash: 'hashed_pw_resident1',
      role: UserRole.RESIDENT,
    },
  });

  await prisma.resident.create({
    data: {
      userId: residentUser1.id,
      apartmentId: apartment.id,
      dong: '101',
      ho: '1204',
      joinStatus: JoinStatus.APPROVED,
    },
  });

  // Resident 2 > 승인 대기
  const residentUser2 = await prisma.user.create({
    data: {
      name: '이영희',
      email: 'lee@weliv.com',
      passwordHash: 'hashed_pw_resident2',
      role: UserRole.RESIDENT,
    },
  });

  await prisma.resident.create({
    data: {
      userId: residentUser2.id,
      apartmentId: apartment.id,
      dong: '102',
      ho: '803',
      joinStatus: JoinStatus.PENDING,
    },
  });

  // Notice
  const notice = await prisma.notice.create({
    data: {
      title: '엘리베이터 점검 안내',
      content: '금주 토요일 오전 9시~12시 점검 예정입니다.',
      apartmentId: apartment.id,
    },
  });

  // Comment
  await prisma.comment.create({
    data: {
      title: '공지 확인',
      content: '확인했습니다. 감사합니다.',
      userId: residentUser1.id,
      noticeId: notice.id,
    },
  });

  // Poll with options
  const poll = await prisma.poll.create({
    data: {
      title: '커뮤니티 시설 확장 여부',
      description: '헬스장/스터디룸 확장에 대한 의견을 묻습니다.',
      apartmentId: apartment.id,
      options: {
        create: [{ text: '확장 찬성' }, { text: '확장 반대' }],
      },
    },
    include: { options: true },
  });

  // Vote (Resident 1 > 찬성)
  await prisma.pollVote.create({
    data: {
      userId: residentUser1.id,
      optionId: poll.options[0].id,
    },
  });

  // Complaint
  await prisma.complaint.create({
    data: {
      title: '주차장 문제',
      content: '주차장이 너무 협소합니다. 개선 요청드립니다.',
      status: ComplaintStatus.RECEIVED,
      userId: residentUser1.id,
      apartmentId: apartment.id,
    },
  });

  console.log('Seed data inserted successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
