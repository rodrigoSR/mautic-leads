import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../entities/lead.entity';

@Injectable()
export class MauticService {
  baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {
    this.baseUrl = 'https://developer.mautic.org';
  }
  async create(userId: number): Promise<void> {
    //Como comunicar com o mautic ? Qual é o metodo, Post, Get ? Qual o payload ?
  }
  async delete(userId: number): Promise<void> {
    //Como comunicar com o mautic ? Qual é o metodo, Post, Get ? Qual o payload ?
    const lead = await this.leadRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!lead) {
      return;
    }

    const mauticId = lead.mauticId;
  }
}
