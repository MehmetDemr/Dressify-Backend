import { Favourite } from "./favourite.model";
import { Product } from "../product/product.model";
import { CreateFavouriteDto } from "./dto/create-favourite.dto";
import { FavouriteResponseDto } from "./dto/favourite-response.dto";
import { AppError } from "../../utils/appError";

export const addFavouriteService = async (
  userId: string,
  dto: CreateFavouriteDto,
) => {
  const product = await Product.findByPk(dto.product_id);
  if (!product) throw new AppError("Product not found.", 404);

  const existing = await Favourite.findOne({
    where: { user_id: userId, product_id: dto.product_id },
  });
  if (existing) throw new AppError("Product is already in favourites.", 409);

  const favourite = await Favourite.create({
    user_id: userId,
    product_id: dto.product_id,
    active: true,
  });

  return new FavouriteResponseDto(favourite);
};

export const getUserFavouritesService = async (userId: string) => {
  const favourites = await Favourite.findAll({
    where: { user_id: userId, active: true },
    include: [
      {
        model: Product,
        attributes: ["id", "productName", "price", "imageUrl"],
      },
    ],
  });
  return favourites.map((f) => new FavouriteResponseDto(f));
};

export const removeFavouriteService = async (
  userId: string,
  favouriteId: string,
) => {
  const favourite = await Favourite.findOne({
    where: { id: favouriteId, user_id: userId },
  });
  if (!favourite) throw new AppError("Favourite not found.", 404);

  await favourite.update({ active: false });
  return { message: "Product removed from favourites." };
};

export const clearFavouritesService = async (userId: string) => {
  await Favourite.update({ active: false }, { where: { user_id: userId } });
  return { message: "All favourites cleared." };
};
