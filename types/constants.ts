// Define the types and enums used in the application

// Transaction Categories
export const TransactionCategory:
  { [key: string]: { name: string, id: number } } = {
  Food: { name: 'Food', id: 1 },
  Household: { name: 'Household', id: 2 },
  Lifestyle: { name: 'Lifestyle', id: 3 },
  Transportation: { name: 'Transportation', id: 4 },
  Shopping: { name: 'Shopping', id: 5 },
  Vacation: { name: 'Vacation', id: 6 },
  Other: { name: 'Other', id: 7 }
}

export const TransactionSubCategory:
  { [key: string]: { name: string, id: number } } = {
  Groceries: { name: 'Groceries', id: 1 },
  FoodOutdoors: { name: 'Food Outdoors', id: 2 },
  Rent: { name: 'Rent', id: 3 },
  Electricity: { name: 'Electricity', id: 4 },
  Internet: { name: 'Internet', id: 5 },
  Insurance: { name: 'Insurance', id: 6 },
  Subscriptions: { name: 'Subscriptions', id: 7 },
  Gifts: { name: 'Gifts', id: 8 },
  Healthcare: { name: 'Healthcare', id: 9 },
  Entertainment: { name: 'Entertainment', id: 10 },
  Taxi: { name: 'Taxi', id: 11 },
  Train: { name: 'Train', id: 12 },
  Clothes: { name: 'Clothes', id: 13 },
  HomeGoods: { name: 'Home Goods', id: 14 },
  Electronics: { name: 'Electronics', id: 15 },
  Other: { name: 'Other', id: 16 }
}
