import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Skill')
export class SkillModel {
  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  category!: string | null;

  @Field(() => String, { nullable: true })
  level!: string | null;
}

@ObjectType('Experience')
export class ExperienceModel {
  @Field()
  company!: string;

  @Field()
  position!: string;

  @Field()
  period!: string;

  @Field(() => [String])
  achievements!: string[];
}

@ObjectType('Project')
export class ProjectModel {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => String, { nullable: true })
  url!: string | null;
}

@ObjectType('Profile')
export class ProfileModel {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => [String])
  links!: string[];

  @Field(() => [SkillModel])
  skills!: SkillModel[];

  @Field(() => [ExperienceModel])
  experience!: ExperienceModel[];

  @Field(() => [ProjectModel])
  projects!: ProjectModel[];
}
