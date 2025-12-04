import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity, generateEntityId, ProductCategory } from "@medusajs/medusa";

@Entity()
export class PhoneAccessorieCategory extends BaseEntity {
  @Index()
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", nullable: true })
  description?: string;

  @Column({ type: "varchar", nullable: true })
  phone_brand?: string; // Apple, Samsung, Xiaomi, etc.

  @Column({ type: "varchar", nullable: true })
  phone_model?: string; // iPhone 15, Galaxy S24, etc.

  @Column({ type: "varchar", nullable: true })
  accessory_type?: string; // cover, screen_protector, charger, etc.

  @Column({ type: "varchar", nullable: true })
  compatibility?: string; // Modelli compatibili

  @Column({ type: "varchar", nullable: true })
  material?: string; // silicone, leather, glass, etc.

  @Column({ type: "varchar", nullable: true })
  color?: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "int", default: 0 })
  sort_order: number;

  @Column({ type: "varchar", nullable: true })
  category_id?: string;

  @ManyToOne(() => ProductCategory, { nullable: true })
  @JoinColumn({ name: "category_id" })
  category?: ProductCategory;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pac");
  }
}
