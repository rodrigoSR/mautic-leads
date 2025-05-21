/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
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
    this.baseUrl = 'https://mautic-mads.gilix.com.br/api';
    this.token = 'Bearer Y2xpZW50ZTpqR2FRbTh1OA==';
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
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/contacts/new`, payload, {
          headers: {
            Authorization: this.token,
            'Content-Type': 'application/json',
          },
        }),
      );

      const mauticId = response.data.contact.id as number;
      await this.leadRepository.update({ id: userId }, { mauticId });
      return mauticId;
    } catch (error) {
      console.error(
        'Erro ao criar contato no Mautic:',

        error.response?.data || error.message,
      );
      throw error;
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
              Authorization: this.token, // ou Basic Auth
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      await this.leadRepository.update({ id: userId }, { mauticId: null });
      const mauticId = await this.create(userId);
      return mauticId;
    } catch (error) {
      console.error(
        'Erro ao deletar contato no Mautic:',

        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async addToSegment(segmentId: string, contactId: number): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/segments/${segmentId}/contact/${contactId}/add`,
          {
            headers: {
              Authorization: this.token, // ou Basic Auth
              'Content-Type': 'application/json',
            },
          },
        ),
      );
    } catch (error) {
      console.error(
        'Erro ao inserir contato no segmento:',

        error.response?.data || error.message,
      );
    }
  }
}
