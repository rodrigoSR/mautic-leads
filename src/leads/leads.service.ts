import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Campaign } from '../campaign/entities/campaign.entity';
import { MauticService } from './mautic/mautic.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Campaign)
    private campaingRepository: Repository<Campaign>,
    private mauticService: MauticService,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<string> {
    const nameParts = createLeadDto.name.trim().split(' ');
    if (nameParts.length < 2) {
      throw new BadRequestException(
        'O nome completo deve conter nome e sobrenome',
      );
    }

    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

    const existingLead = await this.leadRepository.findOne({
      where: {
        email: createLeadDto.email,
      },
    });

    if (existingLead) {
      const campaign = await this.campaingRepository.findOne({
        where: {
          userId: existingLead.id,
        },
      });
      if (campaign) {
        await this.campaingRepository.update(
          {
            id: campaign.id,
          },
          {
            utmSource: createLeadDto.utmSource,
            utmMedium: createLeadDto.utmMedium,
            utmCampaign: createLeadDto.utmCampaign,
            utmContent: createLeadDto.utmContent,
          },
        );
      }

      const mauticId = await this.mauticService.delete(existingLead.id);
      await this.mauticService.addToSegment(mauticId);
      return 'Old user';
    }

    const leadData = this.leadRepository.create({
      firstName: firstName,
      lastName: lastName || undefined,
      email: createLeadDto.email,
      phone: createLeadDto.phone || undefined,
      ipAddress: createLeadDto.ip,
    });

    const lead = await this.leadRepository.save(leadData);

    const campaignData = this.campaingRepository.create({
      utmSource: createLeadDto.utmSource,
      utmMedium: createLeadDto.utmMedium,
      utmCampaign: createLeadDto.utmCampaign,
      utmContent: createLeadDto.utmContent,
      userId: lead.id,
    });

    await this.campaingRepository.save(campaignData);

    const mauticId = await this.mauticService.create(lead.id);
    await this.mauticService.addToSegment(mauticId);

    return 'New user';
  }
}
