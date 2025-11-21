import { Injectable } from '@nestjs/common';
import { JoinStatus, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 중복 체크
  findUserByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findUserByContact(contact: string) {
    return this.prisma.user.findUnique({ where: { contact } });
  }

  // 아파트 조회
  findApartmentByName(name: string) {
    return this.prisma.apartment.findUnique({ where: { name } });
  }

  // User + Resident 동시에 생성
  async createUserAndResident(params: {
    username: string;
    password: string;
    contact: string;
    name: string;
    email: string;
    apartmentId: string;
    apartmentName: string;
    apartmentDong: string;
    apartmentHo: string;
  }) {
    const {
      username,
      password,
      contact,
      name,
      email,
      apartmentId,
      apartmentName,
      apartmentDong,
      apartmentHo,
    } = params;

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          password,
          contact,
          name,
          email,
          role: UserRole.RESIDENT,
          apartmentName,
          apartmentDong,
          apartmentHo,
        },
      });

      const resident = await tx.resident.create({
        data: {
          userId: user.id,
          apartmentId,
          dong: apartmentDong,
          ho: apartmentHo,
          joinStatus: JoinStatus.PENDING,
        },
      });

      return { user, resident };
    });
  }
}
