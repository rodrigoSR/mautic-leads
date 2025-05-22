/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../entities/lead.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MauticService {
  baseUrl: string;
  token: string;
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {
    this.baseUrl = process.env.MAUTIC_URL || '';
    this.token = process.env.MAUTIC_TOKEN || '';
  }
  async create(userId: number): Promise<number> {
    const lead = await this.leadRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!lead) {
      throw new BadRequestException();
    }
    const payload = {
      firstname: lead.firstName,
      lastname: lead.lastName,
      email: lead.email,
      ipAddress: '127.0.0.1',
      overwriteWithBlank: true,
    };
    try {
      const url = `${this.baseUrl}/contacts/new`;
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.token}`,
          },
        }),
      );

      const mauticId = response.data.contact.id as number;
      await this.leadRepository.update({ id: userId }, { mauticId });
      return mauticId;
    } catch (error) {
      console.log(
        JSON.stringify({
          message: 'Error on create',
          data: error.response?.data,
        }),
      );
      throw new InternalServerErrorException();
    }
  }

  async delete(userId: number): Promise<number> {
    const lead = await this.leadRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!lead || !lead.mauticId) {
      throw new BadRequestException();
    }

    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.baseUrl}/contacts/${lead.mauticId}/delete`,
          {
            headers: {
              Authorization: `Basic ${this.token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      await this.leadRepository.update({ id: userId }, { mauticId: null });
      const mauticId = await this.create(userId);
      return mauticId;
    } catch (error) {
      console.log(
        JSON.stringify({
          message: 'Error on delete',
          data: error.response?.data,
        }),
      );
      throw error;
    }
  }

  async addToSegment(contactId: number): Promise<void> {
    try {
      const segmentId = Number(process.env.MAUTIC_SEGMENT_ID || 0);
      const url = `${this.baseUrl}/segments/${segmentId}/contact/${contactId}/add`;
      await firstValueFrom(
        this.httpService.post(
          url,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${this.token}`,
            },
          },
        ),
      );
    } catch (error) {
      console.log(
        JSON.stringify({
          message: 'Error adicionar usuario no seguimento',
          data: error.response?.data,
        }),
      );
    }
  }
}
