import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate'
import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm'
import { IPaginationOptions } from '../types'

export class BaseControllerService<Entity extends BaseEntity> {
  constructor(private readonly repository: Repository<Entity>) {}

  public async findManyWithPagination(
    options: FindManyOptions<Entity>,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<Entity, IPaginationMeta>> {
    return paginate<Entity>(this.repository, paginationOptions, options)
  }

  public async findMany(options: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(options)
  }

  public async findOneOrNull(
    options: FindOneOptions<Entity>,
  ): Promise<Entity | null> {
    return this.repository.findOne(options)
  }

  public async save(data: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(this.repository.create(data))
  }

  public async softDeleteById(id: string | number): Promise<void> {
    await this.repository.softDelete(id)
  }

  public async softDelete(criteria: FindOptionsWhere<Entity>): Promise<void> {
    await this.repository.softDelete(criteria)
  }
}
