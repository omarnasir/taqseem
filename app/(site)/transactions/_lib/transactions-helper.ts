import { CreateTransaction, CreateTransactionDetails, TransactionWithDetails, UpdateTransaction } from "@/app/_types/model/transactions"

// Declare enum for form field ids to avoid hardcoding strings.
enum TransactionFormIdEnum {
  id = 'id',
  name = 'name',
  amount = 'amount',
  strategy = 'strategy',
  transactionDetails = 'transactionDetails',
  category = 'category',
  subCategory = 'subCategory',
  paidAt = 'paidAt',
  paidById = 'paidById',
  notes = 'notes'
}

// Reuse auto-generated types from Prisma.
// Override amount fields to be string instead of number to match form input type.
type FormTransactionDetails = Omit<CreateTransactionDetails, "amount"> & {
  amount: string
}

interface FormTransaction extends Omit<CreateTransaction, "transactionDetails" | "amount"> {
  amount: string,
  transactionDetails: FormTransactionDetails[]
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
    amount: parseFloat(form.amount),
    groupId: groupId,
    paidAt: new Date(form.paidAt as string).toISOString(),
    transactionDetails: userDetails
  }
}

/**
 * Map transaction object to form data.
 * @param transaction - Transaction object.
 * @returns Form data.
 */
function mapTransactionToForm(transaction: TransactionWithDetails): FormTransaction {
  return {
    ...transaction,
    amount: transaction.amount.toFixed(2),
    paidAt: formatDateToString(transaction.paidAt),
    transactionDetails: transaction.transactionDetails.map((detail) => {
      return {
        userId: detail.userId,
        amount: (detail.amount < 0 ? detail.amount * -1 : detail.amount).toString()
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
function getTransactionFormDefaultValues(groupId: string, userId: string): FormTransaction {
  return {
    id: undefined,
    name: '',
    amount: '',
    strategy: 0,
    transactionDetails: [],
    category: 0,
    subCategory: 0,
    paidAt: formatDateToString(new Date()),
    paidById: userId,
    notes: '',
    groupId: groupId,
    createdById: userId,
  }
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

export {
  mapFormToTransaction,
  mapTransactionToForm,
  getTransactionFormDefaultValues,
  formatDateToString,
  TransactionFormIdEnum,
  type FormTransaction,
  type FormTransactionDetails
}