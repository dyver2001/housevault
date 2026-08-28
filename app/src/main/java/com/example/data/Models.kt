package com.example.data

import java.util.UUID

enum class ProjectStatus(val label: String) {
    PENDING_DEPOSIT("Pending Deposit"),
    IN_PROGRESS("In Progress / Shooting"),
    INVOICED("Invoiced (Awaiting Payment)"),
    OVERDUE("Overdue! Action Needed"),
    COLLECTED("Money Collected ✅")
}

enum class ProjectCategory(val label: String) {
    COMMERCIAL("Commercial / Ad"),
    EVENT_WEDDING("Event & Wedding"),
    CORPORATE("Corporate Video"),
    MUSIC_VIDEO("Music Video"),
    POST_EDITING("Post-Production / Editing"),
    DRONE_PHOTO("Drone & Photography")
}

data class FreelanceProject(
    val id: String = UUID.randomUUID().toString(),
    val clientName: String,
    val projectTitle: String,
    val category: ProjectCategory = ProjectCategory.COMMERCIAL,
    val totalFee: Double,
    val depositReceived: Double = 0.0,
    val invoiceNumber: String = "",
    val dueDate: String = "",
    val status: ProjectStatus = ProjectStatus.INVOICED,
    val clientPhone: String = "",
    val clientEmail: String = "",
    val notes: String = ""
) {
    val balanceRemaining: Double
        get() = (totalFee - depositReceived).coerceAtLeast(0.0)

    val isFullyCollected: Boolean
        get() = status == ProjectStatus.COLLECTED || balanceRemaining <= 0.0
}

data class WindfallSplitRule(
    val debtPayoffPercent: Int = 35,
    val savingsTargetPercent: Int = 35,
    val businessTaxReservePercent: Int = 15,
    val safePocketPercent: Int = 15
) {
    fun calculateSplit(amount: Double): Map<String, Double> {
        return mapOf(
            "debt" to (amount * (debtPayoffPercent / 100.0)),
            "savings" to (amount * (savingsTargetPercent / 100.0)),
            "taxReserve" to (amount * (businessTaxReservePercent / 100.0)),
            "safePocket" to (amount * (safePocketPercent / 100.0))
        )
    }
}

enum class DebtType(val label: String) {
    CREDIT_CARD("Credit Card"),
    PERSONAL_LOAN("Bank Personal Loan"),
    OVERDRAFT("Bank Overdraft / Line"),
    EQUIPMENT_LOAN("Camera / Car Finance")
}

data class BankDebt(
    val id: String = UUID.randomUUID().toString(),
    val bankName: String,
    val debtType: DebtType = DebtType.CREDIT_CARD,
    val currentBalance: Double,
    val originalBalance: Double = currentBalance,
    val interestRateApr: Double = 18.5,
    val minMonthlyPayment: Double = 150.0,
    val targetMonthlyPayment: Double = 350.0,
    val dueDayOfMonth: Int = 15,
    val notes: String = ""
) {
    val progressPercent: Float
        get() {
            if (originalBalance <= 0) return 1f
            val paid = (originalBalance - currentBalance).coerceAtLeast(0.0)
            return (paid / originalBalance).toFloat().coerceIn(0f, 1f)
        }
}

enum class TargetPriority(val label: String) {
    CRITICAL("High Priority"),
    MEDIUM("Medium Goal"),
    FLEXIBLE("Long-Term Wish")
}

data class SavingsTarget(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val targetAmount: Double,
    val currentSavedAmount: Double = 0.0,
    val priority: TargetPriority = TargetPriority.CRITICAL,
    val category: String = "House & Family",
    val deadline: String = "Dec 2026",
    val iconName: String = "home"
) {
    val progressPercent: Float
        get() = if (targetAmount > 0) (currentSavedAmount / targetAmount).toFloat().coerceIn(0f, 1f) else 0f

    val remainingAmount: Double
        get() = (targetAmount - currentSavedAmount).coerceAtLeast(0.0)
}

enum class ExpenseCategory(val label: String) {
    HOUSING("Rent / Housing"),
    UTILITIES("Electricity & Water"),
    GROCERIES("Groceries & Food"),
    INTERNET_PHONE("Internet & Mobile"),
    HEALTH("Healthcare & Insurance"),
    TRANSPORT("Car, Fuel & Transit"),
    VIDEO_SOFTWARE("Adobe & Gear Subscriptions"),
    FAMILY_LEISURE("Family & Leisure"),
    MISC("Other Essentials")
}

enum class ExpensePayer(val label: String) {
    WIFE_SALARY("Wife IT Salary (Fixed Base)"),
    FREELANCE_BUFFER("Freelance Videography"),
    SHARED_POOL("Shared Household Pool")
}

data class HouseholdExpense(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val amount: Double,
    val category: ExpenseCategory,
    val isFixed: Boolean = true,
    val assignedPayer: ExpensePayer = ExpensePayer.WIFE_SALARY
)

data class HouseholdProfile(
    val currencySymbol: String = "lei",
    val currencyCode: String = "RON",
    val husbandName: String = "Haytham (Videograf)",
    val wifeName: String = "Cati (IT Support)",
    val wifeMonthlySalary: Double = 6500.0,
    val husbandEstMonthlyGross: Double = 12000.0,
    val emergencyFundMonthsGoal: Int = 6,
    val language: String = "ro",
    val themePreset: String = "emerald",
    val themeMode: String = "dark"
)

data class AuthUser(
    val id: String,
    val email: String,
    val name: String,
    val role: String = "husband",
    val vaultCode: String? = null
)
