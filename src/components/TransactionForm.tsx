"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, DollarSign, TrendingDown, TrendingUp, Calendar, FileText } from "lucide-react"

import { TransactionFormData, Transaction } from '@/types'

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void
  initialData?: Transaction
  onCancel?: () => void
}

export function TransactionForm({ onSubmit, initialData, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: initialData?.amount.toString() || "",
    date: initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : "",
    description: initialData?.description || "",
    type: initialData?.type || "expense",
  })

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {}

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof TransactionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )

  const TransactionTypeButton = ({
    type,
    icon: Icon,
    label,
    isSelected,
  }: {
    type: "expense" | "income"
    icon: React.ComponentType<{ className?: string }>
    label: string
    isSelected: boolean
  }) => (
    <button
      type="button"
      onClick={() => handleChange("type", type)}
      className={`
        relative h-12 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium
        flex items-center justify-center gap-2 group
        ${
          isSelected
            ? type === "expense"
              ? "border-red-500 bg-red-50 text-red-700 shadow-md"
              : "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
        }
      `}
    >
      <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isSelected ? "scale-110" : ""}`} />
      <span>{label}</span>
      {isSelected && (
        <div
          className={`absolute inset-0 rounded-xl ${type === "expense" ? "bg-red-500" : "bg-emerald-500"} opacity-10`}
        />
      )}
    </button>
  )

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg border border-gray-200 bg-white">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            {initialData ? "Update Transaction" : "Add New Transaction"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Amount Field */}
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                Amount *
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg font-medium">₹</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="0.00"
                  className={`
                    pl-10 h-12 text-lg font-medium rounded-xl border-2 transition-all duration-300
                    ${
                      errors.amount
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                    }
                  `}
                />
              </div>
              {errors.amount && <ErrorMessage message={errors.amount} />}
            </div>

            {/* Date Field */}
            <div className="space-y-3">
              <Label htmlFor="date" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={`
                  h-12 rounded-xl border-2 transition-all duration-300
                  ${
                    errors.date
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                  }
                `}
              />
              {errors.date && <ErrorMessage message={errors.date} />}
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                Description *
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="e.g., Groceries, Gas, Salary, Coffee"
                className={`
                  h-12 rounded-xl border-2 transition-all duration-300
                  ${
                    errors.description
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                  }
                `}
              />
              {errors.description && <ErrorMessage message={errors.description} />}
            </div>

            {/* Transaction Type */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-800">Transaction Type *</Label>
              <div className="grid grid-cols-2 gap-4">
                <TransactionTypeButton
                  type="expense"
                  icon={TrendingDown}
                  label="Expense"
                  isSelected={formData.type === "expense"}
                />
                <TransactionTypeButton
                  type="income"
                  icon={TrendingUp}
                  label="Income"
                  isSelected={formData.type === "income"}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="
                  flex-1 h-12 text-base font-semibold rounded-xl
                  bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700
                  text-white shadow-lg hover:shadow-xl
                  transition-all duration-300 transform hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                "
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : initialData ? (
                  "Update Transaction"
                ) : (
                  "Add Transaction"
                )}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="
                    h-12 px-8 text-base font-medium rounded-xl
                    border-2 border-gray-200 text-gray-700 
                    hover:bg-gray-50 hover:border-gray-300
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                   bg-transparent"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
