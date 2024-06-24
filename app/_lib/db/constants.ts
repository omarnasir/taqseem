import {
  MdFastfood as FoodIcon,
  MdHome as HouseholdIcon,
  MdLocalMall as ShoppingIcon,
  MdNightlife as LifestyleIcon,
  MdDirectionsTransit as TransportationIcon,
  MdFlight as VacationIcon,
  MdMoreHoriz as OtherIcon,
  MdBalance as BalanceIcon
} from "react-icons/md"
import { IconType } from "react-icons"

// Define the types and enums used in the application

// Transaction Categories
enum TransactionCategoryEnum {
  Food = 'Food',
  Household = 'Household',
  Lifestyle = 'Lifestyle',
  Transportation = 'Transportation',
  Shopping = 'Shopping',
  Vacation = 'Vacation',
  Other = 'Other'
}

// Transaction Sub Categories
enum TransactionSubCategoryEnum {
  Groceries = 'Groceries',
  FoodOutdoors = 'Food Outdoors',
  Rent = 'Rent',
  Electricity = 'Electricity',
  Internet = 'Internet',
  Insurance = 'Insurance',
  Subscriptions = 'Subscriptions',
  Gifts = 'Gifts',
  Healthcare = 'Healthcare',
  Entertainment = 'Entertainment',
  Taxi = 'Taxi',
  Train = 'Train',
  Clothes = 'Clothes',
  HomeGoods = 'Home Goods',
  Electronics = 'Electronics',
  Other = 'Other'
}

// Transaction Icons
function getTransactionIcon(category: number): IconType {
  if (category === -1) return BalanceIcon;
  const categoryEnum = Object.values(TransactionCategoryEnum)[category]
  let Icon : IconType = OtherIcon
  switch (categoryEnum) {
    case TransactionCategoryEnum.Food:
      Icon = FoodIcon;
      break;
    case TransactionCategoryEnum.Household:
      Icon = HouseholdIcon
      break;
    case TransactionCategoryEnum.Lifestyle:
      Icon = LifestyleIcon
      break;
    case TransactionCategoryEnum.Transportation:
      Icon = TransportationIcon
      break;
    case TransactionCategoryEnum.Shopping:
      Icon = ShoppingIcon
      break;
    case TransactionCategoryEnum.Vacation:
      Icon = VacationIcon
      break;
    default:
      Icon = OtherIcon
      break;
  }
  return Icon
}

enum ActivityTypeEnum {
  CREATE = 0,
  UPDATE = 1
}

export {
  TransactionCategoryEnum,
  TransactionSubCategoryEnum,
  ActivityTypeEnum,
  getTransactionIcon
}