package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

enum class AppTab(val title: String) {
    DASHBOARD("Vault Overview"),
    COLLECTOR("Money Collector"),
    HOUSE_BUDGET("House Budget"),
    BANK_DEBT("Bank Debts"),
    TARGETS("Savings Targets"),
    AI_ADVISOR("AI Advisor"),
    SHARE_APK("APK & iPhone")
}

class HouseVaultViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = HouseVaultRepository(application)
    private val aiService = AiAdvisorService()

    val profile: StateFlow<HouseholdProfile> = repository.profile
    val projects: StateFlow<List<FreelanceProject>> = repository.projects
    val debts: StateFlow<List<BankDebt>> = repository.debts
    val targets: StateFlow<List<SavingsTarget>> = repository.targets
    val expenses: StateFlow<List<HouseholdExpense>> = repository.expenses
    val splitRule: StateFlow<WindfallSplitRule> = repository.splitRule

    private val _currentTab = MutableStateFlow(AppTab.DASHBOARD)
    val currentTab: StateFlow<AppTab> = _currentTab.asStateFlow()

    // AI Advisor State
    private val _aiResponse = MutableStateFlow<String?>(null)
    val aiResponse: StateFlow<String?> = _aiResponse.asStateFlow()

    private val _isAiLoading = MutableStateFlow(false)
    val isAiLoading: StateFlow<Boolean> = _isAiLoading.asStateFlow()

    private val _exportJsonText = MutableStateFlow<String?>(null)
    val exportJsonText: StateFlow<String?> = _exportJsonText.asStateFlow()

    // Cloud Sync State
    val vaultSyncCode: StateFlow<String?> = repository.vaultSyncCode
    val isSyncing: StateFlow<Boolean> = repository.isSyncing
    val lastSyncTimestamp: StateFlow<String?> = repository.lastSyncTimestamp
    val serverUrl: StateFlow<String> = repository.serverUrl

    private val _syncStatusMessage = MutableStateFlow<String?>(null)
    val syncStatusMessage: StateFlow<String?> = _syncStatusMessage.asStateFlow()

    fun updateServerUrl(url: String) {
        repository.updateServerUrl(url)
    }

    fun generateVaultCode(onDone: ((Boolean, String?) -> Unit)? = null) {
        viewModelScope.launch {
            val (ok, code) = repository.createCloudRoom()
            if (ok && code != null) {
                _syncStatusMessage.value = "Seif creat! Cod: $code"
            } else {
                _syncStatusMessage.value = "Eroare conectare la server."
            }
            onDone?.invoke(ok, code)
        }
    }

    fun joinVaultCode(code: String, onDone: ((Boolean) -> Unit)? = null) {
        viewModelScope.launch {
            val ok = repository.joinCloudRoom(code)
            if (ok) {
                _syncStatusMessage.value = "Conectat la $code!"
            } else {
                _syncStatusMessage.value = "Cod invalid sau server offline."
            }
            onDone?.invoke(ok)
        }
    }

    fun syncNow(onDone: ((Boolean) -> Unit)? = null) {
        viewModelScope.launch {
            val ok = repository.syncNow()
            if (ok) {
                _syncStatusMessage.value = "Sincronizat cu succes!"
            } else {
                _syncStatusMessage.value = "Eroare la sincronizare."
            }
            onDone?.invoke(ok)
        }
    }

    fun disconnectSync() {
        repository.disconnectSync()
        _syncStatusMessage.value = "Deconectat."
    }

    fun selectTab(tab: AppTab) {
        _currentTab.value = tab
    }

    // --- Freelance Project Actions ---
    fun addProject(
        clientName: String,
        projectTitle: String,
        category: ProjectCategory,
        totalFee: Double,
        depositReceived: Double,
        dueDate: String,
        invoiceNumber: String,
        clientPhone: String,
        clientEmail: String,
        notes: String
    ) {
        val initialStatus = when {
            depositReceived >= totalFee -> ProjectStatus.COLLECTED
            depositReceived > 0 -> ProjectStatus.IN_PROGRESS
            dueDate.lowercase().contains("overdue") || dueDate.lowercase().contains("past") -> ProjectStatus.OVERDUE
            else -> ProjectStatus.INVOICED
        }

        val project = FreelanceProject(
            clientName = clientName,
            projectTitle = projectTitle,
            category = category,
            totalFee = totalFee,
            depositReceived = depositReceived,
            dueDate = dueDate,
            invoiceNumber = if (invoiceNumber.isNotBlank()) invoiceNumber else "INV-${(1000..9999).random()}",
            status = initialStatus,
            clientPhone = clientPhone,
            clientEmail = clientEmail,
            notes = notes
        )
        repository.addProject(project)
    }

    fun updateProject(project: FreelanceProject) {
        repository.updateProject(project)
    }

    fun deleteProject(projectId: String) {
        repository.deleteProject(projectId)
    }

    fun collectPayment(projectId: String, amount: Double, autoSplit: Boolean) {
        repository.collectProjectPayment(projectId, amount, autoSplit)
    }

    // --- Debt Actions ---
    fun addDebt(
        bankName: String,
        debtType: DebtType,
        balance: Double,
        interestApr: Double,
        minPayment: Double,
        targetPayment: Double,
        dueDay: Int,
        notes: String
    ) {
        val debt = BankDebt(
            bankName = bankName,
            debtType = debtType,
            currentBalance = balance,
            originalBalance = balance,
            interestRateApr = interestApr,
            minMonthlyPayment = minPayment,
            targetMonthlyPayment = targetPayment,
            dueDayOfMonth = dueDay,
            notes = notes
        )
        repository.addDebt(debt)
    }

    fun updateDebt(debt: BankDebt) {
        repository.updateDebt(debt)
    }

    fun deleteDebt(debtId: String) {
        repository.deleteDebt(debtId)
    }

    fun payDebt(debtId: String, amount: Double) {
        repository.makeDebtPayment(debtId, amount)
    }

    // --- Target Actions ---
    fun addTarget(
        title: String,
        targetAmount: Double,
        currentSaved: Double,
        priority: TargetPriority,
        category: String,
        deadline: String,
        iconName: String
    ) {
        val target = SavingsTarget(
            title = title,
            targetAmount = targetAmount,
            currentSavedAmount = currentSaved,
            priority = priority,
            category = category,
            deadline = deadline,
            iconName = iconName
        )
        repository.addTarget(target)
    }

    fun updateTarget(target: SavingsTarget) {
        repository.updateTarget(target)
    }

    fun deleteTarget(targetId: String) {
        repository.deleteTarget(targetId)
    }

    fun depositToTarget(targetId: String, amount: Double) {
        repository.depositToTarget(targetId, amount)
    }

    // --- Expense Actions ---
    fun addExpense(
        title: String,
        amount: Double,
        category: ExpenseCategory,
        isFixed: Boolean,
        payer: ExpensePayer
    ) {
        val expense = HouseholdExpense(
            title = title,
            amount = amount,
            category = category,
            isFixed = isFixed,
            assignedPayer = payer
        )
        repository.addExpense(expense)
    }

    fun updateExpense(expense: HouseholdExpense) {
        repository.updateExpense(expense)
    }

    fun deleteExpense(expenseId: String) {
        repository.deleteExpense(expenseId)
    }

    // --- Profile & Split Rules ---
    fun updateProfile(profile: HouseholdProfile) {
        repository.updateProfile(profile)
    }

    fun updateSplitRule(rule: WindfallSplitRule) {
        repository.updateSplitRule(rule)
    }

    fun resetToDefaults() {
        repository.resetToDefaultSampleData()
    }

    fun exportData() {
        _exportJsonText.value = repository.exportJsonData()
    }

    fun importData(jsonString: String): Boolean {
        return repository.importJson(jsonString)
    }

    // --- AI Advisor Query ---
    fun askAiAdvisor(prompt: String) {
        viewModelScope.launch {
            _isAiLoading.value = true
            _aiResponse.value = null
            val response = aiService.getFinancialAdvice(
                userPrompt = prompt,
                profile = profile.value,
                projects = projects.value,
                debts = debts.value,
                targets = targets.value,
                expenses = expenses.value
            )
            _aiResponse.value = response
            _isAiLoading.value = false
        }
    }
}
