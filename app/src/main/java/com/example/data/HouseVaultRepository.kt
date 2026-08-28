package com.example.data

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

class HouseVaultRepository(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("house_vault_data", Context.MODE_PRIVATE)

    private val repoScope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    private val _profile = MutableStateFlow(loadProfile())
    val profile: StateFlow<HouseholdProfile> = _profile.asStateFlow()

    private val _projects = MutableStateFlow(loadProjects())
    val projects: StateFlow<List<FreelanceProject>> = _projects.asStateFlow()

    private val _debts = MutableStateFlow(loadDebts())
    val debts: StateFlow<List<BankDebt>> = _debts.asStateFlow()

    private val _targets = MutableStateFlow(loadTargets())
    val targets: StateFlow<List<SavingsTarget>> = _targets.asStateFlow()

    private val _expenses = MutableStateFlow(loadExpenses())
    val expenses: StateFlow<List<HouseholdExpense>> = _expenses.asStateFlow()

    private val _splitRule = MutableStateFlow(loadSplitRule())
    val splitRule: StateFlow<WindfallSplitRule> = _splitRule.asStateFlow()

    private val _vaultSyncCode = MutableStateFlow(prefs.getString("vault_sync_code", null))
    val vaultSyncCode: StateFlow<String?> = _vaultSyncCode.asStateFlow()

    @Volatile
    private var lastLocalModificationTime: Long = 0L

    init {
        // Continuous Live Polling loop for couple sync (every 4 seconds)
        repoScope.launch {
            while (true) {
                try {
                    val code = _vaultSyncCode.value
                    val timeSinceLocalEdit = System.currentTimeMillis() - lastLocalModificationTime
                    if (code != null && !_isSyncing.value && timeSinceLocalEdit > 3500) {
                        val (ok, dataJson) = CloudSyncService.fetchVaultSnapshot(_serverUrl.value, code)
                        if (ok && dataJson != null) {
                            importFullDataFromJsonObject(dataJson)
                        }
                    }
                } catch (e: Exception) {
                    // network retry
                }
                delay(4000)
            }
        }
    }

    private fun triggerAutoPush() {
        lastLocalModificationTime = System.currentTimeMillis()
        val code = _vaultSyncCode.value ?: return
        repoScope.launch {
            try {
                CloudSyncService.pushVaultUpdate(
                    _serverUrl.value,
                    code,
                    exportFullDataAsJsonObject(),
                    _deviceName.value,
                    getDeviceInfoJson()
                )
            } catch (e: Exception) {
                // ignore
            }
        }
    }

    private val _isSyncing = MutableStateFlow(false)
    val isSyncing: StateFlow<Boolean> = _isSyncing.asStateFlow()

    private val _lastSyncTimestamp = MutableStateFlow(prefs.getString("last_sync_timestamp", null))
    val lastSyncTimestamp: StateFlow<String?> = _lastSyncTimestamp.asStateFlow()

    private val _serverUrl = MutableStateFlow(prefs.getString("server_url", "https://housevault.onrender.com") ?: "https://housevault.onrender.com")
    val serverUrl: StateFlow<String> = _serverUrl.asStateFlow()

    private val _deviceId = MutableStateFlow(getOrCreateDeviceId())
    val deviceId: StateFlow<String> = _deviceId.asStateFlow()

    private val _deviceName = MutableStateFlow(prefs.getString("device_name", "📱 Telefon Haytham (Android)") ?: "📱 Telefon Haytham (Android)")
    val deviceName: StateFlow<String> = _deviceName.asStateFlow()

    private val _currentUser = MutableStateFlow<AuthUser?>(loadStoredUser())
    val currentUser: StateFlow<AuthUser?> = _currentUser.asStateFlow()

    private val _authToken = MutableStateFlow<String?>(prefs.getString("auth_token", null))
    val authToken: StateFlow<String?> = _authToken.asStateFlow()

    private fun loadStoredUser(): AuthUser? {
        val id = prefs.getString("user_id", null) ?: return null
        val email = prefs.getString("user_email", "") ?: ""
        val name = prefs.getString("user_name", "") ?: ""
        val role = prefs.getString("user_role", "husband") ?: "husband"
        val code = prefs.getString("user_vault_code", null)
        return AuthUser(id = id, email = email, name = name, role = role, vaultCode = code)
    }

    private fun saveStoredUser(user: AuthUser?, token: String?) {
        _currentUser.value = user
        _authToken.value = token
        val editor = prefs.edit()
        if (user != null && token != null) {
            editor.putString("auth_token", token)
            editor.putString("user_id", user.id)
            editor.putString("user_email", user.email)
            editor.putString("user_name", user.name)
            editor.putString("user_role", user.role)
            editor.putString("user_vault_code", user.vaultCode)
        } else {
            editor.remove("auth_token")
            editor.remove("user_id")
            editor.remove("user_email")
            editor.remove("user_name")
            editor.remove("user_role")
            editor.remove("user_vault_code")
        }
        editor.apply()
    }

    suspend fun login(email: String, pass: String): AuthResult {
        val res = AuthService.login(_serverUrl.value, email, pass, getDeviceInfoJson())
        if (res.success && res.user != null && res.token != null) {
            saveStoredUser(res.user, res.token)
            if (res.user.vaultCode != null) {
                setSyncCode(res.user.vaultCode)
            }
            if (res.vaultData != null) {
                importFullDataFromJsonObject(res.vaultData)
            }
        }
        return res
    }

    suspend fun register(email: String, pass: String, name: String, role: String, vaultCode: String?): AuthResult {
        val res = AuthService.register(_serverUrl.value, email, pass, name, role, vaultCode, getDeviceInfoJson())
        if (res.success && res.user != null && res.token != null) {
            saveStoredUser(res.user, res.token)
            if (res.user.vaultCode != null) {
                setSyncCode(res.user.vaultCode)
            }
            if (res.vaultData != null) {
                importFullDataFromJsonObject(res.vaultData)
            }
        }
        return res
    }

    fun logout() {
        saveStoredUser(null, null)
    }

    private fun getOrCreateDeviceId(): String {
        var id = prefs.getString("device_id", null)
        if (id == null) {
            val chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
            val rand = (1..4).map { chars.random() }.joinToString("")
            id = "DEV-$rand"
            prefs.edit().putString("device_id", id).apply()
        }
        return id
    }

    fun updateDeviceName(name: String) {
        val clean = name.trim()
        _deviceName.value = clean
        prefs.edit().putString("device_name", clean).apply()
    }

    fun getDeviceInfoJson(): JSONObject {
        return JSONObject().apply {
            put("deviceId", _deviceId.value)
            put("deviceName", _deviceName.value)
            put("deviceType", "android")
            put("ownerName", "Haytham")
        }
    }

    fun updateServerUrl(url: String) {
        val clean = url.trim()
        _serverUrl.value = clean
        prefs.edit().putString("server_url", clean).apply()
    }

    fun setSyncCode(code: String?) {
        _vaultSyncCode.value = code
        prefs.edit().putString("vault_sync_code", code).apply()
    }

    suspend fun createCloudRoom(customUrl: String? = null): Pair<Boolean, String?> {
        val targetUrl = customUrl ?: _serverUrl.value
        _isSyncing.value = true
        val initialJson = exportFullDataAsJsonObject()
        val partnerName = _deviceName.value
        val (ok, code) = CloudSyncService.createVaultRoom(targetUrl, initialJson, partnerName, getDeviceInfoJson())
        _isSyncing.value = false
        if (ok && code != null) {
            setSyncCode(code)
            _lastSyncTimestamp.value = "Acum"
            prefs.edit().putString("last_sync_timestamp", "Acum").apply()
        }
        return Pair(ok, code)
    }

    suspend fun joinCloudRoom(code: String, customUrl: String? = null): Boolean {
        val targetUrl = customUrl ?: _serverUrl.value
        _isSyncing.value = true
        val (ok, dataJson) = CloudSyncService.joinVaultRoom(targetUrl, code, getDeviceInfoJson())
        _isSyncing.value = false
        if (ok && dataJson != null) {
            importFullDataFromJsonObject(dataJson)
            setSyncCode(code.trim().uppercase())
            _lastSyncTimestamp.value = "Acum"
            prefs.edit().putString("last_sync_timestamp", "Acum").apply()
            return true
        }
        return false
    }

    suspend fun syncNow(customUrl: String? = null): Boolean {
        val code = _vaultSyncCode.value ?: return false
        val targetUrl = customUrl ?: _serverUrl.value
        _isSyncing.value = true
        val (fetchOk, dataJson) = CloudSyncService.fetchVaultSnapshot(targetUrl, code)
        if (fetchOk && dataJson != null) {
            importFullDataFromJsonObject(dataJson)
        }
        val pushOk = CloudSyncService.pushVaultUpdate(
            targetUrl,
            code,
            exportFullDataAsJsonObject(),
            _deviceName.value,
            getDeviceInfoJson()
        )
        _isSyncing.value = false
        if (pushOk) {
            _lastSyncTimestamp.value = "Acum"
            prefs.edit().putString("last_sync_timestamp", "Acum").apply()
        }
        return pushOk
    }

    fun disconnectSync() {
        setSyncCode(null)
        _lastSyncTimestamp.value = null
        prefs.edit().remove("last_sync_timestamp").apply()
    }

    // --- Profile Actions ---
    fun updateProfile(newProfile: HouseholdProfile) {
        _profile.value = newProfile
        saveProfile(newProfile)
        triggerAutoPush()
    }

    // --- Freelance Projects Actions ---
    fun addProject(project: FreelanceProject) {
        val updated = listOf(project) + _projects.value
        _projects.value = updated
        saveProjects(updated)
        triggerAutoPush()
    }

    fun updateProject(project: FreelanceProject) {
        val updated = _projects.value.map { if (it.id == project.id) project else it }
        _projects.value = updated
        saveProjects(updated)
        triggerAutoPush()
    }

    fun deleteProject(projectId: String) {
        val updated = _projects.value.filterNot { it.id == projectId }
        _projects.value = updated
        saveProjects(updated)
        triggerAutoPush()
    }

    fun collectProjectPayment(projectId: String, collectedAmount: Double, autoSplit: Boolean = true) {
        val project = _projects.value.find { it.id == projectId } ?: return
        val newDeposit = (project.depositReceived + collectedAmount).coerceAtMost(project.totalFee)
        val newStatus = if (newDeposit >= project.totalFee) ProjectStatus.COLLECTED else project.status
        val updatedProject = project.copy(depositReceived = newDeposit, status = newStatus)
        val updated = _projects.value.map { if (it.id == updatedProject.id) updatedProject else it }
        _projects.value = updated
        saveProjects(updated)

        if (autoSplit && collectedAmount > 0) {
            val splits = _splitRule.value.calculateSplit(collectedAmount)
            val debtPart = splits["debt"] ?: 0.0
            val savingsPart = splits["savings"] ?: 0.0

            if (debtPart > 0 && _debts.value.isNotEmpty()) {
                applyPaymentToTopDebt(debtPart)
            }
            if (savingsPart > 0 && _targets.value.isNotEmpty()) {
                applyDepositToTopTarget(savingsPart)
            }
        }
        triggerAutoPush()
    }

    // --- Debt Actions ---
    fun addDebt(debt: BankDebt) {
        val updated = _debts.value + debt
        _debts.value = updated
        saveDebts(updated)
        triggerAutoPush()
    }

    fun updateDebt(debt: BankDebt) {
        val updated = _debts.value.map { if (it.id == debt.id) debt else it }
        _debts.value = updated
        saveDebts(updated)
        triggerAutoPush()
    }

    fun deleteDebt(debtId: String) {
        val updated = _debts.value.filterNot { it.id == debtId }
        _debts.value = updated
        saveDebts(updated)
        triggerAutoPush()
    }

    fun makeDebtPayment(debtId: String, paymentAmount: Double) {
        val debt = _debts.value.find { it.id == debtId } ?: return
        val newBalance = (debt.currentBalance - paymentAmount).coerceAtLeast(0.0)
        val updatedDebt = debt.copy(currentBalance = newBalance)
        val updated = _debts.value.map { if (it.id == updatedDebt.id) updatedDebt else it }
        _debts.value = updated
        saveDebts(updated)
        triggerAutoPush()
    }

    private fun applyPaymentToTopDebt(amount: Double) {
        val activeDebts = _debts.value.filter { it.currentBalance > 0 }
        if (activeDebts.isEmpty()) return

        // Avalanche: highest interest first
        val targetDebt = activeDebts.maxByOrNull { it.interestRateApr } ?: activeDebts.first()
        makeDebtPayment(targetDebt.id, amount)
    }

    // --- Savings Target Actions ---
    fun addTarget(target: SavingsTarget) {
        val updated = _targets.value + target
        _targets.value = updated
        saveTargets(updated)
        triggerAutoPush()
    }

    fun updateTarget(target: SavingsTarget) {
        val updated = _targets.value.map { if (it.id == target.id) target else it }
        _targets.value = updated
        saveTargets(updated)
        triggerAutoPush()
    }

    fun deleteTarget(targetId: String) {
        val updated = _targets.value.filterNot { it.id == targetId }
        _targets.value = updated
        saveTargets(updated)
        triggerAutoPush()
    }

    fun depositToTarget(targetId: String, depositAmount: Double) {
        val target = _targets.value.find { it.id == targetId } ?: return
        val newAmount = target.currentSavedAmount + depositAmount
        val updated = target.copy(currentSavedAmount = newAmount)
        val updatedList = _targets.value.map { if (it.id == updated.id) updated else it }
        _targets.value = updatedList
        saveTargets(updatedList)
        triggerAutoPush()
    }

    private fun applyDepositToTopTarget(amount: Double) {
        val unfinished = _targets.value.filter { it.currentSavedAmount < it.targetAmount }
        if (unfinished.isEmpty()) return
        val target = unfinished.firstOrNull { it.priority == TargetPriority.CRITICAL } ?: unfinished.first()
        depositToTarget(target.id, amount)
    }

    // --- Expense Actions ---
    fun addExpense(expense: HouseholdExpense) {
        val updated = _expenses.value + expense
        _expenses.value = updated
        saveExpenses(updated)
        triggerAutoPush()
    }

    fun updateExpense(expense: HouseholdExpense) {
        val updated = _expenses.value.map { if (it.id == expense.id) expense else it }
        _expenses.value = updated
        saveExpenses(updated)
        triggerAutoPush()
    }

    fun deleteExpense(expenseId: String) {
        val updated = _expenses.value.filterNot { it.id == expenseId }
        _expenses.value = updated
        saveExpenses(updated)
        triggerAutoPush()
    }

    // --- Split Rule Actions ---
    fun updateSplitRule(rule: WindfallSplitRule) {
        _splitRule.value = rule
        saveSplitRule(rule)
        triggerAutoPush()
    }

    fun resetToDefaultSampleData() {
        val defaultProfile = createDefaultProfile()
        val defaultProjects = createDefaultProjects()
        val defaultDebts = createDefaultDebts()
        val defaultTargets = createDefaultTargets()
        val defaultExpenses = createDefaultExpenses()
        val defaultRule = WindfallSplitRule()

        _profile.value = defaultProfile
        _projects.value = defaultProjects
        _debts.value = defaultDebts
        _targets.value = defaultTargets
        _expenses.value = defaultExpenses
        _splitRule.value = defaultRule

        saveProfile(defaultProfile)
        saveProjects(defaultProjects)
        saveDebts(defaultDebts)
        saveTargets(defaultTargets)
        saveExpenses(defaultExpenses)
        saveSplitRule(defaultRule)
    }

    fun exportFullDataAsJsonObject(): JSONObject {
        val root = JSONObject()
        val p = _profile.value
        root.put("profile", JSONObject().apply {
            put("currencySymbol", p.currencySymbol)
            put("currencyCode", p.currencyCode)
            put("husbandName", p.husbandName)
            put("wifeName", p.wifeName)
            put("wifeMonthlySalary", p.wifeMonthlySalary)
            put("husbandEstMonthlyGross", p.husbandEstMonthlyGross)
            put("emergencyFundMonthsGoal", p.emergencyFundMonthsGoal)
            put("language", p.language)
            put("themePreset", p.themePreset)
            put("themeMode", p.themeMode)
        })

        val projectsArr = JSONArray()
        _projects.value.forEach { pr ->
            projectsArr.put(JSONObject().apply {
                put("id", pr.id)
                put("clientName", pr.clientName)
                put("projectTitle", pr.projectTitle)
                put("category", pr.category.name)
                put("totalFee", pr.totalFee)
                put("depositReceived", pr.depositReceived)
                put("invoiceNumber", pr.invoiceNumber)
                put("dueDate", pr.dueDate)
                put("status", pr.status.name)
                put("clientPhone", pr.clientPhone)
                put("clientEmail", pr.clientEmail)
                put("notes", pr.notes)
            })
        }
        root.put("projects", projectsArr)

        val debtsArr = JSONArray()
        _debts.value.forEach { d ->
            debtsArr.put(JSONObject().apply {
                put("id", d.id)
                put("bankName", d.bankName)
                put("debtType", d.debtType.name)
                put("currentBalance", d.currentBalance)
                put("originalBalance", d.originalBalance)
                put("interestRateApr", d.interestRateApr)
                put("minMonthlyPayment", d.minMonthlyPayment)
                put("targetMonthlyPayment", d.targetMonthlyPayment)
                put("dueDayOfMonth", d.dueDayOfMonth)
                put("notes", d.notes)
            })
        }
        root.put("debts", debtsArr)

        val targetsArr = JSONArray()
        _targets.value.forEach { t ->
            targetsArr.put(JSONObject().apply {
                put("id", t.id)
                put("title", t.title)
                put("targetAmount", t.targetAmount)
                put("currentSavedAmount", t.currentSavedAmount)
                put("priority", t.priority.name)
                put("category", t.category)
                put("deadline", t.deadline)
                put("iconName", t.iconName)
            })
        }
        root.put("targets", targetsArr)

        val expArr = JSONArray()
        _expenses.value.forEach { e ->
            expArr.put(JSONObject().apply {
                put("id", e.id)
                put("title", e.title)
                put("amount", e.amount)
                put("category", e.category.name)
                put("isFixed", e.isFixed)
                put("assignedPayer", e.assignedPayer.name)
            })
        }
        root.put("expenses", expArr)

        val sr = _splitRule.value
        root.put("splitRule", JSONObject().apply {
            put("debtPayoffPercent", sr.debtPayoffPercent)
            put("savingsTargetPercent", sr.savingsTargetPercent)
            put("businessTaxReservePercent", sr.businessTaxReservePercent)
            put("safePocketPercent", sr.safePocketPercent)
        })

        return root
    }

    fun importFullDataFromJsonObject(root: JSONObject): Boolean {
        return importJson(root.toString())
    }

    fun exportJsonData(): String {
        val root = JSONObject()
        root.put("version", 1)

        val prof = _profile.value
        val profJson = JSONObject().apply {
            put("currencySymbol", prof.currencySymbol)
            put("currencyCode", prof.currencyCode)
            put("husbandName", prof.husbandName)
            put("wifeName", prof.wifeName)
            put("wifeMonthlySalary", prof.wifeMonthlySalary)
            put("husbandEstMonthlyGross", prof.husbandEstMonthlyGross)
        }
        root.put("profile", profJson)

        val projectsArr = JSONArray()
        _projects.value.forEach { p ->
            projectsArr.put(JSONObject().apply {
                put("id", p.id)
                put("clientName", p.clientName)
                put("projectTitle", p.projectTitle)
                put("category", p.category.name)
                put("totalFee", p.totalFee)
                put("depositReceived", p.depositReceived)
                put("invoiceNumber", p.invoiceNumber)
                put("dueDate", p.dueDate)
                put("status", p.status.name)
                put("clientPhone", p.clientPhone)
                put("clientEmail", p.clientEmail)
                put("notes", p.notes)
            })
        }
        root.put("projects", projectsArr)

        val debtsArr = JSONArray()
        _debts.value.forEach { d ->
            debtsArr.put(JSONObject().apply {
                put("id", d.id)
                put("bankName", d.bankName)
                put("debtType", d.debtType.name)
                put("currentBalance", d.currentBalance)
                put("originalBalance", d.originalBalance)
                put("interestRateApr", d.interestRateApr)
                put("minMonthlyPayment", d.minMonthlyPayment)
                put("targetMonthlyPayment", d.targetMonthlyPayment)
                put("dueDayOfMonth", d.dueDayOfMonth)
                put("notes", d.notes)
            })
        }
        root.put("debts", debtsArr)

        val targetsArr = JSONArray()
        _targets.value.forEach { t ->
            targetsArr.put(JSONObject().apply {
                put("id", t.id)
                put("title", t.title)
                put("targetAmount", t.targetAmount)
                put("currentSavedAmount", t.currentSavedAmount)
                put("priority", t.priority.name)
                put("category", t.category)
                put("deadline", t.deadline)
                put("iconName", t.iconName)
            })
        }
        root.put("targets", targetsArr)

        val expArr = JSONArray()
        _expenses.value.forEach { e ->
            expArr.put(JSONObject().apply {
                put("id", e.id)
                put("title", e.title)
                put("amount", e.amount)
                put("category", e.category.name)
                put("isFixed", e.isFixed)
                put("assignedPayer", e.assignedPayer.name)
            })
        }
        root.put("expenses", expArr)

        return root.toString(2)
    }

    fun importJson(jsonString: String): Boolean {
        return try {
            val root = JSONObject(jsonString)
            if (root.has("profile")) {
                val p = root.getJSONObject("profile")
                val current = _profile.value
                val loadedProfile = HouseholdProfile(
                    currencySymbol = p.optString("currencySymbol", current.currencySymbol),
                    currencyCode = p.optString("currencyCode", current.currencyCode),
                    husbandName = p.optString("husbandName", current.husbandName),
                    wifeName = p.optString("wifeName", current.wifeName),
                    wifeMonthlySalary = p.optDouble("wifeMonthlySalary", current.wifeMonthlySalary),
                    husbandEstMonthlyGross = p.optDouble("husbandEstMonthlyGross", current.husbandEstMonthlyGross),
                    emergencyFundMonthsGoal = p.optInt("emergencyFundMonthsGoal", current.emergencyFundMonthsGoal),
                    language = p.optString("language", current.language),
                    themePreset = p.optString("themePreset", current.themePreset),
                    themeMode = p.optString("themeMode", current.themeMode)
                )
                _profile.value = loadedProfile
                saveProfile(loadedProfile)
            }

            if (root.has("projects")) {
                val arr = root.getJSONArray("projects")
                val list = mutableListOf<FreelanceProject>()
                for (i in 0 until arr.length()) {
                    val o = arr.getJSONObject(i)
                    list.add(
                        FreelanceProject(
                            id = o.optString("id"),
                            clientName = o.optString("clientName"),
                            projectTitle = o.optString("projectTitle"),
                            category = try { ProjectCategory.valueOf(o.optString("category")) } catch (e: Exception) { ProjectCategory.COMMERCIAL },
                            totalFee = o.optDouble("totalFee"),
                            depositReceived = o.optDouble("depositReceived"),
                            invoiceNumber = o.optString("invoiceNumber"),
                            dueDate = o.optString("dueDate"),
                            status = try { ProjectStatus.valueOf(o.optString("status")) } catch (e: Exception) { ProjectStatus.INVOICED },
                            clientPhone = o.optString("clientPhone"),
                            clientEmail = o.optString("clientEmail"),
                            notes = o.optString("notes")
                        )
                    )
                }
                _projects.value = list
                saveProjects(list)
            }

            if (root.has("debts")) {
                val arr = root.getJSONArray("debts")
                val list = mutableListOf<BankDebt>()
                for (i in 0 until arr.length()) {
                    val o = arr.getJSONObject(i)
                    list.add(
                        BankDebt(
                            id = o.optString("id"),
                            bankName = o.optString("bankName"),
                            debtType = try { DebtType.valueOf(o.optString("debtType")) } catch (e: Exception) { DebtType.CREDIT_CARD },
                            currentBalance = o.optDouble("currentBalance"),
                            originalBalance = o.optDouble("originalBalance"),
                            interestRateApr = o.optDouble("interestRateApr"),
                            minMonthlyPayment = o.optDouble("minMonthlyPayment"),
                            targetMonthlyPayment = o.optDouble("targetMonthlyPayment"),
                            dueDayOfMonth = o.optInt("dueDayOfMonth"),
                            notes = o.optString("notes")
                        )
                    )
                }
                _debts.value = list
                saveDebts(list)
            }

            if (root.has("targets")) {
                val arr = root.getJSONArray("targets")
                val list = mutableListOf<SavingsTarget>()
                for (i in 0 until arr.length()) {
                    val o = arr.getJSONObject(i)
                    list.add(
                        SavingsTarget(
                            id = o.optString("id"),
                            title = o.optString("title"),
                            targetAmount = o.optDouble("targetAmount"),
                            currentSavedAmount = o.optDouble("currentSavedAmount"),
                            priority = try { TargetPriority.valueOf(o.optString("priority")) } catch (e: Exception) { TargetPriority.CRITICAL },
                            category = o.optString("category"),
                            deadline = o.optString("deadline"),
                            iconName = o.optString("iconName")
                        )
                    )
                }
                _targets.value = list
                saveTargets(list)
            }

            if (root.has("expenses")) {
                val arr = root.getJSONArray("expenses")
                val list = mutableListOf<HouseholdExpense>()
                for (i in 0 until arr.length()) {
                    val o = arr.getJSONObject(i)
                    list.add(
                        HouseholdExpense(
                            id = o.optString("id"),
                            title = o.optString("title"),
                            amount = o.optDouble("amount"),
                            category = try { ExpenseCategory.valueOf(o.optString("category")) } catch (e: Exception) { ExpenseCategory.HOUSING },
                            isFixed = o.optBoolean("isFixed", true),
                            assignedPayer = try { ExpensePayer.valueOf(o.optString("assignedPayer")) } catch (e: Exception) { ExpensePayer.WIFE_SALARY }
                        )
                    )
                }
                _expenses.value = list
                saveExpenses(list)
            }
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    // --- Private Persistence Helpers ---

    private fun loadProfile(): HouseholdProfile {
        val json = prefs.getString("profile_json", null) ?: return createDefaultProfile()
        return try {
            val o = JSONObject(json)
            var hName = o.optString("husbandName", "Haytham (Videograf)")
            var wName = o.optString("wifeName", "Cati (IT Support)")
            if (hName.contains("Alex")) hName = "Haytham (Videograf)"
            if (wName.contains("Elena")) wName = "Cati (IT Support)"
            HouseholdProfile(
                currencySymbol = o.optString("currencySymbol", "lei"),
                currencyCode = o.optString("currencyCode", "RON"),
                husbandName = hName,
                wifeName = wName,
                wifeMonthlySalary = o.optDouble("wifeMonthlySalary", 6500.0),
                husbandEstMonthlyGross = o.optDouble("husbandEstMonthlyGross", 12500.0),
                emergencyFundMonthsGoal = o.optInt("emergencyFundMonthsGoal", 6),
                language = o.optString("language", "ro"),
                themePreset = o.optString("themePreset", "emerald"),
                themeMode = o.optString("themeMode", "dark")
            )
        } catch (e: Exception) {
            createDefaultProfile()
        }
    }

    private fun saveProfile(profile: HouseholdProfile) {
        val o = JSONObject().apply {
            put("currencySymbol", profile.currencySymbol)
            put("currencyCode", profile.currencyCode)
            put("husbandName", profile.husbandName)
            put("wifeName", profile.wifeName)
            put("wifeMonthlySalary", profile.wifeMonthlySalary)
            put("husbandEstMonthlyGross", profile.husbandEstMonthlyGross)
            put("emergencyFundMonthsGoal", profile.emergencyFundMonthsGoal)
            put("language", profile.language)
            put("themePreset", profile.themePreset)
            put("themeMode", profile.themeMode)
        }
        prefs.edit().putString("profile_json", o.toString()).apply()
    }

    private fun loadProjects(): List<FreelanceProject> {
        val json = prefs.getString("projects_json", null) ?: return createDefaultProjects()
        return try {
            val arr = JSONArray(json)
            val list = mutableListOf<FreelanceProject>()
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                list.add(
                    FreelanceProject(
                        id = o.optString("id"),
                        clientName = o.optString("clientName"),
                        projectTitle = o.optString("projectTitle"),
                        category = try { ProjectCategory.valueOf(o.optString("category")) } catch (e: Exception) { ProjectCategory.COMMERCIAL },
                        totalFee = o.optDouble("totalFee"),
                        depositReceived = o.optDouble("depositReceived"),
                        invoiceNumber = o.optString("invoiceNumber"),
                        dueDate = o.optString("dueDate"),
                        status = try { ProjectStatus.valueOf(o.optString("status")) } catch (e: Exception) { ProjectStatus.INVOICED },
                        clientPhone = o.optString("clientPhone"),
                        clientEmail = o.optString("clientEmail"),
                        notes = o.optString("notes")
                    )
                )
            }
            list
        } catch (e: Exception) {
            createDefaultProjects()
        }
    }

    private fun saveProjects(list: List<FreelanceProject>) {
        val arr = JSONArray()
        list.forEach { p ->
            arr.put(JSONObject().apply {
                put("id", p.id)
                put("clientName", p.clientName)
                put("projectTitle", p.projectTitle)
                put("category", p.category.name)
                put("totalFee", p.totalFee)
                put("depositReceived", p.depositReceived)
                put("invoiceNumber", p.invoiceNumber)
                put("dueDate", p.dueDate)
                put("status", p.status.name)
                put("clientPhone", p.clientPhone)
                put("clientEmail", p.clientEmail)
                put("notes", p.notes)
            })
        }
        prefs.edit().putString("projects_json", arr.toString()).apply()
    }

    private fun loadDebts(): List<BankDebt> {
        val json = prefs.getString("debts_json", null) ?: return createDefaultDebts()
        return try {
            val arr = JSONArray(json)
            val list = mutableListOf<BankDebt>()
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                list.add(
                    BankDebt(
                        id = o.optString("id"),
                        bankName = o.optString("bankName"),
                        debtType = try { DebtType.valueOf(o.optString("debtType")) } catch (e: Exception) { DebtType.CREDIT_CARD },
                        currentBalance = o.optDouble("currentBalance"),
                        originalBalance = o.optDouble("originalBalance"),
                        interestRateApr = o.optDouble("interestRateApr"),
                        minMonthlyPayment = o.optDouble("minMonthlyPayment"),
                        targetMonthlyPayment = o.optDouble("targetMonthlyPayment"),
                        dueDayOfMonth = o.optInt("dueDayOfMonth"),
                        notes = o.optString("notes")
                    )
                )
            }
            list
        } catch (e: Exception) {
            createDefaultDebts()
        }
    }

    private fun saveDebts(list: List<BankDebt>) {
        val arr = JSONArray()
        list.forEach { d ->
            arr.put(JSONObject().apply {
                put("id", d.id)
                put("bankName", d.bankName)
                put("debtType", d.debtType.name)
                put("currentBalance", d.currentBalance)
                put("originalBalance", d.originalBalance)
                put("interestRateApr", d.interestRateApr)
                put("minMonthlyPayment", d.minMonthlyPayment)
                put("targetMonthlyPayment", d.targetMonthlyPayment)
                put("dueDayOfMonth", d.dueDayOfMonth)
                put("notes", d.notes)
            })
        }
        prefs.edit().putString("debts_json", arr.toString()).apply()
    }

    private fun loadTargets(): List<SavingsTarget> {
        val json = prefs.getString("targets_json", null) ?: run {
            val defaults = createDefaultTargets()
            saveTargets(defaults)   // seeds widget prefs on first install
            return defaults
        }
        return try {
            val arr = JSONArray(json)
            val list = mutableListOf<SavingsTarget>()
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                list.add(
                    SavingsTarget(
                        id = o.optString("id"),
                        title = o.optString("title"),
                        targetAmount = o.optDouble("targetAmount"),
                        currentSavedAmount = o.optDouble("currentSavedAmount"),
                        priority = try { TargetPriority.valueOf(o.optString("priority")) } catch (e: Exception) { TargetPriority.CRITICAL },
                        category = o.optString("category"),
                        deadline = o.optString("deadline"),
                        iconName = o.optString("iconName")
                    )
                )
            }
            saveTargets(list)   // refresh widget prefs every cold start
            list
        } catch (e: Exception) {
            val defaults = createDefaultTargets()
            saveTargets(defaults)
            defaults
        }
    }

    private fun saveTargets(list: List<SavingsTarget>) {
        val arr = JSONArray()
        list.forEach { t ->
            arr.put(JSONObject().apply {
                put("id", t.id)
                put("title", t.title)
                put("targetAmount", t.targetAmount)
                put("currentSavedAmount", t.currentSavedAmount)
                put("priority", t.priority.name)
                put("category", t.category)
                put("deadline", t.deadline)
                put("iconName", t.iconName)
            })
        }
        prefs.edit().putString("targets_json", arr.toString()).apply()

        // ─── Widget bridge: write Seat Ateca live progress to widget-readable prefs ───
        val ateca = list.firstOrNull {
            it.iconName == "car" || it.title.contains("Ateca", ignoreCase = true) || it.title.contains("Seat", ignoreCase = true)
        }
        if (ateca != null) {
            val pct = if (ateca.targetAmount > 0)
                ((ateca.currentSavedAmount / ateca.targetAmount) * 100).toInt().coerceIn(0, 100)
            else 0
            val savedFmt = ateca.currentSavedAmount.toLong()
            val targetFmt = ateca.targetAmount.toLong()
            prefs.edit()
                .putInt("widget_car_percent", pct)
                .putLong("widget_car_saved", savedFmt)
                .putLong("widget_car_target", targetFmt)
                .putString("widget_car_title", "🚙 ${ateca.title}")
                .putString("widget_car_deadline", ateca.deadline)
                .apply()
        }
    }

    private fun loadExpenses(): List<HouseholdExpense> {
        val json = prefs.getString("expenses_json", null) ?: return createDefaultExpenses()
        return try {
            val arr = JSONArray(json)
            val list = mutableListOf<HouseholdExpense>()
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                list.add(
                    HouseholdExpense(
                        id = o.optString("id"),
                        title = o.optString("title"),
                        amount = o.optDouble("amount"),
                        category = try { ExpenseCategory.valueOf(o.optString("category")) } catch (e: Exception) { ExpenseCategory.HOUSING },
                        isFixed = o.optBoolean("isFixed", true),
                        assignedPayer = try { ExpensePayer.valueOf(o.optString("assignedPayer")) } catch (e: Exception) { ExpensePayer.WIFE_SALARY }
                    )
                )
            }
            list
        } catch (e: Exception) {
            createDefaultExpenses()
        }
    }

    private fun saveExpenses(list: List<HouseholdExpense>) {
        val arr = JSONArray()
        list.forEach { e ->
            arr.put(JSONObject().apply {
                put("id", e.id)
                put("title", e.title)
                put("amount", e.amount)
                put("category", e.category.name)
                put("isFixed", e.isFixed)
                put("assignedPayer", e.assignedPayer.name)
            })
        }
        prefs.edit().putString("expenses_json", arr.toString()).apply()
    }

    private fun loadSplitRule(): WindfallSplitRule {
        val debt = prefs.getInt("split_debt", 35)
        val savings = prefs.getInt("split_savings", 35)
        val tax = prefs.getInt("split_tax", 15)
        val safe = prefs.getInt("split_safe", 15)
        return WindfallSplitRule(debt, savings, tax, safe)
    }

    private fun saveSplitRule(rule: WindfallSplitRule) {
        prefs.edit()
            .putInt("split_debt", rule.debtPayoffPercent)
            .putInt("split_savings", rule.savingsTargetPercent)
            .putInt("split_tax", rule.businessTaxReservePercent)
            .putInt("split_safe", rule.safePocketPercent)
            .apply()
    }

    // --- Seed Initial Real-Life Data in RON ---

    private fun createDefaultProfile() = HouseholdProfile(
        currencySymbol = "lei",
        currencyCode = "RON",
        husbandName = "Haytham (Videograf)",
        wifeName = "Cati (IT Support)",
        wifeMonthlySalary = 6500.0,
        husbandEstMonthlyGross = 12500.0,
        emergencyFundMonthsGoal = 6,
        language = "ro",
        themePreset = "emerald",
        themeMode = "dark"
    )

    private fun createDefaultProjects() = listOf(
        FreelanceProject(
            clientName = "Apex Media Agency",
            projectTitle = "Spot Publicitar Video Brand 4K",
            category = ProjectCategory.COMMERCIAL,
            totalFee = 8500.0,
            depositReceived = 4000.0,
            invoiceNumber = "INV-2026-081",
            dueDate = "Vinerea Viitoare",
            status = ProjectStatus.INVOICED,
            clientPhone = "+40 722 123 456",
            clientEmail = "contabilitate@apexagency.ro",
            notes = "Colorizare finalizată. Se așteaptă plata restului de 4.500 lei."
        ),
        FreelanceProject(
            clientName = "Nuntă Radu & Andreea",
            projectTitle = "Pachet Cinematic Video Nuntă + Dronă",
            category = ProjectCategory.EVENT_WEDDING,
            totalFee = 7500.0,
            depositReceived = 3500.0,
            invoiceNumber = "INV-2026-079",
            dueDate = "Sfârșitul Lunii",
            status = ProjectStatus.INVOICED,
            clientPhone = "+40 733 987 654",
            notes = "Materialele brute și teaserul predate. Rest de încasat 4.000 lei la predarea finală."
        ),
        FreelanceProject(
            clientName = "TechSummit România",
            projectTitle = "Filmări Conferință 3 Zile & Recaps",
            category = ProjectCategory.CORPORATE,
            totalFee = 6000.0,
            depositReceived = 0.0,
            invoiceNumber = "INV-2026-068",
            dueDate = "Depășit termenul (10 zile)",
            status = ProjectStatus.OVERDUE,
            clientPhone = "+40 744 555 777",
            clientEmail = "financiar@techsummit.ro",
            notes = "Termenul de plată a fost 15 zile. Necesită mesaj de reamintire WhatsApp!"
        ),
        FreelanceProject(
            clientName = "Resort Cazare Transilvania",
            projectTitle = "Pachet 6x Reels Promovare Turism",
            category = ProjectCategory.COMMERCIAL,
            totalFee = 4200.0,
            depositReceived = 2100.0,
            invoiceNumber = "INV-2026-085",
            dueDate = "În 2 Săptămâni",
            status = ProjectStatus.IN_PROGRESS,
            notes = "Filmările au fost realizate. Se lucrează la montaj."
        ),
        FreelanceProject(
            clientName = "Brand Haine UrbanStyle",
            projectTitle = "Lookbook Teaser Toamnă",
            category = ProjectCategory.COMMERCIAL,
            totalFee = 3800.0,
            depositReceived = 3800.0,
            invoiceNumber = "INV-2026-072",
            dueDate = "Achitat",
            status = ProjectStatus.COLLECTED,
            notes = "Plătit integral prin virament bancar."
        )
    )

    private fun createDefaultDebts() = listOf(
        BankDebt(
            bankName = "Card Credit Banca Transilvania",
            debtType = DebtType.CREDIT_CARD,
            currentBalance = 7500.0,
            originalBalance = 12000.0,
            interestRateApr = 21.5,
            minMonthlyPayment = 350.0,
            targetMonthlyPayment = 1200.0,
            dueDayOfMonth = 18,
            notes = "Cea mai mare dobândă! Prima țintă pentru lichidare rapidă din încasări."
        ),
        BankDebt(
            bankName = "Credit Echipament Foto-Video",
            debtType = DebtType.EQUIPMENT_LOAN,
            currentBalance = 14500.0,
            originalBalance = 22000.0,
            interestRateApr = 9.2,
            minMonthlyPayment = 650.0,
            targetMonthlyPayment = 1000.0,
            dueDayOfMonth = 5,
            notes = "Rate pentru camera video cinema și obiective."
        ),
        BankDebt(
            bankName = "Descoperire de Cont (Overdraft)",
            debtType = DebtType.OVERDRAFT,
            currentBalance = 2800.0,
            originalBalance = 5000.0,
            interestRateApr = 16.0,
            minMonthlyPayment = 200.0,
            targetMonthlyPayment = 600.0,
            dueDayOfMonth = 25,
            notes = "Linie de credit utilizată în sezonul rece."
        )
    )

    private fun createDefaultTargets() = listOf(
        SavingsTarget(
            title = "Seat Ateca (15.000 €)",
            targetAmount = 75000.0,
            currentSavedAmount = 22500.0,
            priority = TargetPriority.CRITICAL,
            category = "Mașină Familie",
            deadline = "Dec 2027",
            iconName = "car"
        ),
        SavingsTarget(
            title = "Avans Casă / Apartament Nou",
            targetAmount = 120000.0,
            currentSavedAmount = 32000.0,
            priority = TargetPriority.CRITICAL,
            category = "Locuință Familie",
            deadline = "Dec 2027",
            iconName = "home"
        ),
        SavingsTarget(
            title = "Fond Siguranță 6 Luni",
            targetAmount = 40000.0,
            currentSavedAmount = 14000.0,
            priority = TargetPriority.CRITICAL,
            category = "Siguranță",
            deadline = "Iun 2027",
            iconName = "shield"
        ),
        SavingsTarget(
            title = "Cameră Sony FX3 + Obiective GM",
            targetAmount = 25000.0,
            currentSavedAmount = 11000.0,
            priority = TargetPriority.MEDIUM,
            category = "Echipamente Video",
            deadline = "Nov 2026",
            iconName = "camera"
        ),
        SavingsTarget(
            title = "Vacanță Familie de Vară",
            targetAmount = 9000.0,
            currentSavedAmount = 4500.0,
            priority = TargetPriority.FLEXIBLE,
            category = "Timp Liber & Familie",
            deadline = "Aug 2027",
            iconName = "airplane"
        )
    )

    private fun createDefaultExpenses() = listOf(
        HouseholdExpense(title = "Chirie Apartament", amount = 2400.0, category = ExpenseCategory.HOUSING, isFixed = true, assignedPayer = ExpensePayer.WIFE_SALARY),
        HouseholdExpense(title = "Cumpărături & Mâncare Familie", amount = 1800.0, category = ExpenseCategory.GROCERIES, isFixed = true, assignedPayer = ExpensePayer.WIFE_SALARY),
        HouseholdExpense(title = "Întreținere, Curent, Gaze & Apă", amount = 550.0, category = ExpenseCategory.UTILITIES, isFixed = true, assignedPayer = ExpensePayer.WIFE_SALARY),
        HouseholdExpense(title = "Internet Fibră & 2x Abonamente Mobile", amount = 180.0, category = ExpenseCategory.INTERNET_PHONE, isFixed = true, assignedPayer = ExpensePayer.WIFE_SALARY),
        HouseholdExpense(title = "Asigurare Sănătate & Farmacie", amount = 350.0, category = ExpenseCategory.HEALTH, isFixed = true, assignedPayer = ExpensePayer.WIFE_SALARY),
        HouseholdExpense(title = "Combustibil & Transport", amount = 450.0, category = ExpenseCategory.TRANSPORT, isFixed = true, assignedPayer = ExpensePayer.WIFE_SALARY),
        HouseholdExpense(title = "Abonamente Adobe CC & Stocare Cloud", amount = 280.0, category = ExpenseCategory.VIDEO_SOFTWARE, isFixed = true, assignedPayer = ExpensePayer.FREELANCE_BUFFER),
        HouseholdExpense(title = "Ieșiri în Oraș & Recreere Familie", amount = 500.0, category = ExpenseCategory.FAMILY_LEISURE, isFixed = false, assignedPayer = ExpensePayer.FREELANCE_BUFFER)
    )
}
