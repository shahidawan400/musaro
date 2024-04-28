import { Session } from "inspector"
import { AggregateOptions, Callback, FilterQuery, InsertManyOptions, PipelineStage, ProjectionType, QueryOptions, SaveOptions, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose"
import { AbstractSchema } from "../abstracts/schema/abstract.schema"

export type NestedKeys<T> = {
  [K in keyof T]?: T[K] extends Record<string, any> ? NestedKeys<T[K]> : 1 | 0
}
export interface IPaginateOptions<T> {
  filterQuery?: FilterQuery<T>
  search?: string
  searchMethod?: 'or' | 'and'
  searchBy?: NestedKeys<Omit<T, '_id'>>
  limit?: number
  offset?: number
  returnKey?: string
  sort?: Object
  projection?: ProjectionType<T>
  pipelines?: any[] // Consider defining a specific type for pipelines
  bottomPipelines?: PipelineStage[]
  all?: boolean
  searchByCustom?: Record<string, 1>
}
export interface IPaginatedResult {
  [x: string]: any
  meta: {
    page: number
    pages: number
    limit: number
    total: number
  }
}
export interface IAbstractRepository<T extends AbstractSchema> {

  create(document: T, options?: SaveOptions): Promise<T>
  createMany(documents: Omit<T, "_id">[], options?: InsertManyOptions): Promise<T[]>
  delete(filterQuery?: FilterQuery<T>): Promise<T[]>
  deleteMany(filterQuery: FilterQuery<T>, ids?: string[], column?: string): Promise<any>
  deleteManyWithoutException(filterQuery: FilterQuery<T>, ids?: string[], column?: string): Promise<any>
  findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T>
  findOne(filterQuery: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T>
  updateMany(filterQuery: FilterQuery<T>, updates?: UpdateQuery<T> | UpdateWithAggregationPipeline, options?: {}): Promise<any>
  findOneAndUpdate(filterQuery: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<T>
  upsert(filterQuery: FilterQuery<T>, document: Partial<T>): Promise<any>
  find(filterQuery?: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T[]>
  startTransaction(): Promise<any>
  paginate(options: IPaginateOptions<T>): Promise<IPaginatedResult>
  // count(filterQuery?: FilterQuery<T>): Promise<number>
  getDetails(): Promise<any>
  paginate(options: IPaginateOptions<T>): Promise<IPaginatedResult>

}
