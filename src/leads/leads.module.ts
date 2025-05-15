import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity';
import { MauticService } from './mautic/mautic.service';
import { Campaign } from '../campaign/entities/campaign.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Campaign]), HttpModule],
  controllers: [LeadsController],
  providers: [LeadsService, MauticService],
})
export class LeadsModule {}
