import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HashService } from 'src/common/hash.service';
import { BrokersService } from 'src/brokers/brokers.service';
import { BrokerGroupsService } from 'src/broker_groups/brokerGroups.service';
import { JwtModule } from '@nestjs/jwt';
import { ProductsService } from 'src/products/products.service';
import { PlansService } from 'src/plans/plans.service';
import { CustomerPlansService } from 'src/customer_plans/customerPlan.service';
import { InsuranceCompaniesService } from 'src/insurance_companies/insuranceCompanies.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    HashService,
    BrokerGroupsService,
    BrokersService,
    ProductsService,
    InsuranceCompaniesService,
    PlansService,
    CustomerPlansService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
