import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import {
  SignupUserRequestDto,
  SignupUserResponseDto,
} from './dto/signup-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  async signup(dto: SignupUserRequestDto): Promise<SignupUserResponseDto> {
    const {
      username,
      password,
      contact,
      name,
      email,
      apartmentName,
      apartmentDong,
      apartmentHo,
    } = dto;

    // 1. 아파트 존재 확인
    const apt = await this.repo.findApartmentByName(apartmentName);
    if (!apt) throw new BadRequestException('유효하지 않은 아파트명입니다.');

    // 2. 중복 확인 : username, email, contact
    if (await this.repo.findUserByUsername(username))
      throw new ConflictException('이미 사용중인 아이디 입니다.');

    if (await this.repo.findUserByEmail(email))
      throw new ConflictException('이미 사용중인 이메일 입니다.');

    if (await this.repo.findUserByContact(contact))
      throw new ConflictException('이미 사용중인 연락처입니다.');

    // 3. 비밀번호 해싱
    const passwordHash = await bcrypt 
  }
}
