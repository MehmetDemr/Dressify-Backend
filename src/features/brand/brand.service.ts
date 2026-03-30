import { Brand } from "./brand.model";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { BrandResponseDto } from "./dto/brand-response.dto";
import { AppError } from "../../utils/appError";

export const createBrandService = async (dto: CreateBrandDto) => {
  const existing = await Brand.findOne({ where: { brandSlug: dto.brandSlug } });
  if (existing) throw new AppError("This brand slug is already taken.", 409);

  const brand = await Brand.create({ ...dto, active: true });
  return new BrandResponseDto(brand);
};

export const getAllBrandsService = async () => {
  const brands = await Brand.findAll({ where: { active: true } });
  return brands.map((b) => new BrandResponseDto(b));
};

export const getBrandByIdService = async (id: string) => {
  const brand = await Brand.findByPk(id);
  if (!brand) throw new AppError("Brand not found.", 404);
  return new BrandResponseDto(brand);
};

export const updateBrandService = async (id: string, dto: UpdateBrandDto) => {
  const brand = await Brand.findByPk(id);
  if (!brand) throw new AppError("Brand not found.", 404);

  if (dto.brandSlug && dto.brandSlug !== brand.brandSlug) {
    const existing = await Brand.findOne({
      where: { brandSlug: dto.brandSlug },
    });
    if (existing) throw new AppError("This brand slug is already taken.", 409);
  }

  await brand.update(dto);
  return new BrandResponseDto(brand);
};

export const deleteBrandService = async (id: string) => {
  const brand = await Brand.findByPk(id);
  if (!brand) throw new AppError("Brand not found.", 404);

  await brand.update({ active: false });
  return { message: "Brand deleted successfully." };
};
