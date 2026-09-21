import type { Entity, PublicEntity } from "@/server/entities/types";
import type { Location } from "@/server/locations/types";
import { toPublicLocation } from "@/server/locations/validation";

export function toPublicEntity(
  entity: Entity,
  location?: Location | null,
): PublicEntity {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    logo_path: entity.logo_path,
    public_description: entity.public_description,
    email: entity.show_email ? entity.email : null,
    phone: entity.show_phone ? entity.phone : null,
    website_url: entity.show_website ? entity.website_url : null,
    location: location ? toPublicLocation(location) : null,
  };
}
