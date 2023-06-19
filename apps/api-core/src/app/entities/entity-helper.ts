import { AfterInsert, AfterLoad, BaseEntity } from 'typeorm'

export class EntityHelper extends BaseEntity {
  __entity?: string

  @AfterLoad()
  @AfterInsert()
  setEntityName() {
    this.__entity = this.constructor.name
  }
}
