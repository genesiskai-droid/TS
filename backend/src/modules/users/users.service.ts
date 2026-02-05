import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...data } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    return await (this.prisma as any).user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return await (this.prisma as any).user.findMany();
  }

  async findOne(id: string) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return await (this.prisma as any).user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...data } = updateUserDto;

    const updateData: Record<string, unknown> = { ...data };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    return await (this.prisma as any).user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return await (this.prisma as any).user.delete({
      where: { id },
    });
  }

  // ========== CLIENT METHODS ==========

  async createClient(data: {
    id: string; // DNI o RUC
    type: 'NATURAL' | 'JURIDICA';
    name: string;
    lastName?: string;
    email: string;
    phone: string;
    address: string;
    password?: string;
  }) {
    const { password, ...clientData } = data;

    const clientDataWithPassword = password
      ? { ...clientData, password: await bcrypt.hash(password, 10) }
      : clientData;
    return await (this.prisma as any).client.create({
      data: clientDataWithPassword,
    });
  }

  async findAllClients() {
    return await (this.prisma as any).client.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findClientById(id: string) {
    const client = await (this.prisma as any).client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async updateClient(
    id: string,
    data: Partial<{
      type: 'NATURAL' | 'JURIDICA';
      name: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
    }>,
  ) {
    return await (this.prisma as any).client.update({
      where: { id },
      data,
    });
  }

  // ========== TECHNICAL STAFF METHODS ==========

  async createTechnicalStaff(data: {
    dni: string;
    name: string;
    email: string;
    password?: string;
    phone: string;
    level: number;
    seniority: 'Senior' | 'Semi_Senior' | 'Novato';
    specialty: string;
    secondarySkills?: string[];
    address: string;
    isVersatile?: boolean;
  }) {
    const { password, ...staffData } = data;

    const staffDataWithPassword = password
      ? { ...staffData, password: await bcrypt.hash(password, 10) }
      : staffData;
    return await (this.prisma as any).technicalStaff.create({
      data: {
        ...staffDataWithPassword,
        currentWorkload: 0,
      },
    });
  }

  async findAllTechnicalStaff() {
    return await (this.prisma as any).technicalStaff.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findTechnicalStaffById(id: string) {
    const staff = await (this.prisma as any).technicalStaff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException(`Technical staff with ID ${id} not found`);
    }

    return staff;
  }

  async updateTechnicalStaff(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      level: number;
      seniority: 'Senior' | 'Semi_Senior' | 'Novato';
      specialty: string;
      secondarySkills: string[];
      address: string;
      isVersatile: boolean;
    }>,
  ) {
    return await (this.prisma as any).technicalStaff.update({
      where: { id },
      data,
    });
  }

  async incrementWorkload(id: string) {
    const staff = await (this.prisma as any).technicalStaff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException(`Technical staff with ID ${id} not found`);
    }
    return await (this.prisma as any).technicalStaff.update({
      where: { id },
      data: { currentWorkload: staff.currentWorkload + 1 },
    });
  }

  async decrementWorkload(id: string) {
    const staff = await (this.prisma as any).technicalStaff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException(`Technical staff with ID ${id} not found`);
    }
    return await (this.prisma as any).technicalStaff.update({
      where: { id },
      data: { currentWorkload: Math.max(0, staff.currentWorkload - 1) },
    });
  }
}
