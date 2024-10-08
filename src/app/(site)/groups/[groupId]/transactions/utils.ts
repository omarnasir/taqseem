import { 
  type CreateTransactionDetails, 
  type CreateTransaction, 
  type UpdateTransaction, 
  type TransactionWithDetails,
  type FormTransaction,
  type TransactionDetails
} from "@/types/transactions.type"
import { UserBasicData } from "@/types/users.type"


// Declare enum for form field ids to avoid hardcoding strings.
enum FormIdEnum {
  id = 'id',
  name = 'name',
  amount = 'amount',
  transactionDetails = 'transactionDetails',
  category = 'category',
  subCategory = 'subCategory',
  paidAt = 'paidAt',
  paidById = 'paidById',
  notes = 'notes',
  isSettlement = 'isSettlement',
}

/**
 * Format date to string.
 * @param date - Date object.
 * @returns Formatted date string.
 */
function formatDateToString(date: Date) {
  const formattedDate = new Date(date).toLocaleDateString('en-ca', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
  return formattedDate
}

/**
 * Map form data to transaction object.
 * @param form - Form data.
 * @param userDetails - Transaction details.
 * @param groupId - Group id.
 * @returns Transaction object.
  */
function mapFormToTransaction(form: FormTransaction, userDetails: CreateTransactionDetails[], groupId: string): CreateTransaction | UpdateTransaction {

  return {
    ...form,
    category: form.isSettlement ? -1 : form.category,
    subCategory: form.isSettlement ? -1 : form.subCategory,
    amount: parseFloat(form.amount as string),
    groupId: groupId,
    paidAt: new Date(form.paidAt + 'T' + new Date().toISOString().split('T')[1]),
    transactionDetails: userDetails
  }
}

/**
 * Map transaction object to form data.
 * @param transaction - Transaction object.
 * @returns Form data.
 */
function mapTransactionToForm(transaction: TransactionWithDetails, users: UserBasicData[]): FormTransaction {
  return {
    ...transaction,
    category: transaction.isSettlement ? 0 : transaction.category,
    subCategory: transaction.isSettlement ? 0 : transaction.subCategory,
    amount: Math.abs(transaction.amount).toFixed(2),
    paidAt: formatDateToString(transaction.paidAt),
    transactionDetails: users.map((user) => {
      const detail = transaction.transactionDetails.find((detail) => detail.userId === user.id) as TransactionDetails
      return {
        ...detail,
        userId: user.id,
        amount: detail ? detail.amount.toFixed(2) : undefined,
      }
    })
  }
}

/**
 * Declare Transaction Form default values.
 * @param groupId - Group id of the active group.
 * @param userId - User id of the current user.
 * @returns Form data.
 */
function getTransactionFormDefaultValues(groupId: string, userId: string, users: UserBasicData[]): FormTransaction {
  return {
    id: -1,
    name: '',
    amount: '',
    transactionDetails: users.map(user => ({ userId: user.id, amount: '', id: -1, createdAt: new Date(), transactionId: -1 })),
    category: 0,
    subCategory: 0,
    isSettlement: false,
    paidAt: formatDateToString(new Date()),
    paidById: userId,
    notes: '',
    groupId: groupId,
    createdById: userId,
    createdAt: new Date(),
  }
}

export {
  FormIdEnum,
  mapFormToTransaction,
  mapTransactionToForm,
  getTransactionFormDefaultValues,
  formatDateToString,
}