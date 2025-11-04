import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback, FeedbackCategory } from '../../entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return await this.feedbackRepository.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async findByCustomer(customerId: string): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreviewed(): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      where: { reviewed: false },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.findOne(id);
    Object.assign(feedback, updateFeedbackDto);
    return await this.feedbackRepository.save(feedback);
  }

  async remove(id: string): Promise<void> {
    const feedback = await this.findOne(id);
    await this.feedbackRepository.remove(feedback);
  }

  async getAverageRating(category?: FeedbackCategory): Promise<number> {
    const query = this.feedbackRepository.createQueryBuilder('feedback');

    if (category) {
      query.where('feedback.category = :category', { category });
    }

    const result = await query
      .select('AVG(feedback.rating)', 'average')
      .getRawOne();

    return parseFloat(result.average) || 0;
  }

  async getFeedbackStats() {
    const total = await this.feedbackRepository.count();
    const unreviewed = await this.feedbackRepository.count({ where: { reviewed: false } });
    const averageRating = await this.getAverageRating();

    const categoryStats = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select('feedback.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(feedback.rating)', 'avgRating')
      .groupBy('feedback.category')
      .getRawMany();

    return {
      total,
      unreviewed,
      averageRating,
      categoryStats,
    };
  }
}










