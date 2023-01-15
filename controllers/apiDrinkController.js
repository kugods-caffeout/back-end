const {Drink} = require("../model/Drink");
const {Size} = require("../model/Size");
const {User} = require("../model/User");
const {Log} = require("../model/Log");
const {httpResponse} = require("../config/http-response");

const apiDrinkController = {
  getAllDrinks: async (req, res) => {
    try {
      const drinksInfo = await Drink.find(
        {},
        {
          _id: true,
          brand: true,
          drink_name: true,
          temp: true,
          img: true,
          size: true,
          kcal: true,
          caffeine: true,
        },
      );
      return httpResponse.SUCCESS_OK(res, "", drinksInfo);
    } catch (error) {
      return httpResponse.BAD_REQUEST(res, "", error);
    }
  },

  postDrink: async (req, res) => {
    try {
      const {brand, drink_name, temp, img, size, kcal, caffeine} = req.body;
      const newDrink = await Drink.create({
        brand,
        drink_name,
        temp,
        img,
        size,
        kcal,
        caffeine,
      });
      httpResponse.SUCCESS_OK(res, "", newDrink);
    } catch (error) {
      httpResponse.BAD_REQUEST(res, "", error);
    }
  },

  getOneDrink: async (req, res) => {
    try {
      const {drinkId} = req.params;
      const drinkInfo = await Drink.find(
        {_id: drinkId},
        {
          _id: true,
          brand: true,
          drink_name: true,
          temp: true,
          img: true,
          size: true,
          kcal: true,
          caffeine: true,
        },
      );
      httpResponse.SUCCESS_OK(res, "", drinkInfo);
    } catch (error) {
      httpResponse.BAD_REQUEST(res, "", error);
    }
  },

  // patchDrink: async (req, res) => {
  //   try {
  //     const {drinkID} = req.params;
  //     const {brand, drink_name, temp, img, size, kcal, caffeine} = req.body;
  //     const newDrink = await Drink.findByIdAndUpdate(
  //       drinkID,
  //       {
  //         brand,
  //         drink_name,
  //         temp,
  //         img,
  //         size,
  //         kcal,
  //         caffeine,
  //       },
  //       {new: true},
  //     );
  //     httpResponse.SUCCESS_OK(res, "", newDrink);
  //   } catch (error) {
  //     httpResponse.BAD_REQUEST(res, "", error);
  //   }
  // },

  // deleteDrink: async (req, res) => {
  //   try {
  //     const {drinkID} = req.params;
  //     await Drink.findByIdAndDelete(drinkID);
  //     httpResponse.SUCCESS_OK(
  //       res,
  //       `id가 ${drinkID}인 drink를 삭제했습니다.`,
  //       {},
  //     );
  //   } catch (error) {
  //     httpResponse.BAD_REQUEST(res, "", error);
  //   }
  // },

  getSearchDrink: async (req, res) => {
    try {
      const {searchKeyword} = req.params;
      const result = await Drink.aggregate([
        {
          $search: {
            index: "default",
            text: {
              query: searchKeyword,
              path: {
                wildcard: "*",
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            brand: 1,
            drink_name: 1,
            temp: 1,
            img: 1,
            size: 1,
            kcal: 1,
            caffeine: 1,
          },
        },
      ]);
      httpResponse.SUCCESS_OK(res, `searchkey : ${searchKeyword}`, result);
    } catch (error) {
      httpResponse.BAD_REQUEST(res, "", error);
    }
  },
};

module.exports = apiDrinkController;