import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'SurfaceTypes' })
export class SurfaceTypeEntity {
  @PrimaryKey()
  surfaceType: string;

  @Property()
  description: string;
}
