import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity, generateEntityId, Product } from "@medusajs/medusa";

@Entity()
export class ProductExtended extends BaseEntity {
  @Index()
  @Column({ type: "varchar" })
  product_id: string;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;

  // Attributi specifici per telefonia
  @Column({ type: "varchar", nullable: true })
  phone_brand?: string; // Apple, Samsung, Xiaomi, etc.

  @Column({ type: "varchar", nullable: true })
  phone_model?: string; // iPhone 15 Pro, Galaxy S24 Ultra, etc.

  @Column({ type: "varchar", nullable: true })
  compatibility?: string; // Lista modelli compatibili separati da virgola

  @Column({ type: "varchar", nullable: true })
  accessory_type?: string; // cover, screen_protector, charger, cable, etc.

  @Column({ type: "varchar", nullable: true })
  material?: string; // silicone, leather, glass, plastic, metal

  @Column({ type: "varchar", nullable: true })
  color?: string;

  @Column({ type: "varchar", nullable: true })
  size?: string; // Per cover: slim, rugged, etc.

  @Column({ type: "boolean", default: false })
  wireless_charging_compatible?: boolean;

  @Column({ type: "varchar", nullable: true })
  connector_type?: string; // USB-C, Lightning, Micro-USB

  @Column({ type: "varchar", nullable: true })
  cable_length?: string; // 1m, 2m, 3m

  @Column({ type: "varchar", nullable: true })
  power_output?: string; // 20W, 65W, etc.

  @Column({ type: "boolean", default: false })
  fast_charging?: boolean;

  @Column({ type: "varchar", nullable: true })
  screen_size?: string; // Per screen protector

  @Column({ type: "varchar", nullable: true })
  protection_level?: string; // 9H, military grade, etc.

  // Attributi Denea
  @Column({ type: "varchar", nullable: true })
  denea_sku?: string; // SKU nel gestionale Denea

  @Column({ type: "varchar", nullable: true })
  denea_category?: string;

  @Column({ type: "varchar", nullable: true })
  supplier_code?: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  cost_price?: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  margin_percentage?: number;

  @Column({ type: "timestamp", nullable: true })
  last_sync_at?: Date;

  // SEO e Marketing
  @Column({ type: "text", nullable: true })
  seo_title?: string;

  @Column({ type: "text", nullable: true })
  seo_description?: string;

  @Column({ type: "varchar", nullable: true })
  seo_keywords?: string;

  @Column({ type: "boolean", default: false })
  is_featured?: boolean;

  @Column({ type: "boolean", default: false })
  is_bestseller?: boolean;

  @Column({ type: "boolean", default: false })
  is_new_arrival?: boolean;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pext");
  }
}
