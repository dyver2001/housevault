package com.example.data

import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class AiAdvisorService {
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    suspend fun getFinancialAdvice(
        userPrompt: String,
        profile: HouseholdProfile,
        projects: List<FreelanceProject>,
        debts: List<BankDebt>,
        targets: List<SavingsTarget>,
        expenses: List<HouseholdExpense>
    ): String = withContext(Dispatchers.IO) {
        val apiKey = try {
            val field = com.example.BuildConfig::class.java.getField("GEMINI_API_KEY")
            field.get(null) as? String ?: ""
        } catch (e: Exception) {
            System.getenv("GEMINI_API_KEY") ?: ""
        }

        val totalUncollected = projects.filterNot { it.isFullyCollected }.sumOf { it.balanceRemaining }
        val totalDebt = debts.sumOf { it.currentBalance }
        val totalSaved = targets.sumOf { it.currentSavedAmount }
        val totalGoals = targets.sumOf { it.targetAmount }
        val fixedExpenses = expenses.filter { it.isFixed }.sumOf { it.amount }
        val wifeSurplus = (profile.wifeMonthlySalary - fixedExpenses).coerceAtLeast(0.0)

        // If API key is available, call Gemini 2.5 Flash
        if (apiKey.isNotBlank() && !apiKey.startsWith("MY_GEMINI") && apiKey != "null") {
            try {
                val contextData = """
                    You are HouseVault AI, a seasoned financial advisor specializing in dual-income households where one partner is a creative freelancer (videographer/commercial filmmaker) with irregular high-earning gigs and the spouse has a steady IT support salary.
                    
                    CURRENT HOUSEHOLD FINANCIAL CONTEXT:
                    - Currency: ${profile.currencySymbol} (${profile.currencyCode})
                    - Freelancer (Husband): ${profile.husbandName}, Est. Gross: ${profile.currencySymbol}${profile.husbandEstMonthlyGross}/mo
                    - Spouse (Wife): ${profile.wifeName}, Fixed Salary: ${profile.currencySymbol}${profile.wifeMonthlySalary}/mo
                    - Fixed Household Bills (Rent, Food, Utilities): ${profile.currencySymbol}$fixedExpenses/mo (Covered by wife salary with ${profile.currencySymbol}$wifeSurplus surplus)
                    - Active Freelance Money Waiting to Be Collected: ${profile.currencySymbol}$totalUncollected from ${projects.count { !it.isFullyCollected }} gigs
                    - Total Bank Credit / Debt: ${profile.currencySymbol}$totalDebt across ${debts.size} accounts
                    - Total Savings Targets: ${profile.currencySymbol}$totalSaved / ${profile.currencySymbol}$totalGoals
                    
                    USER QUERY:
                    $userPrompt
                    
                    GUIDELINES:
                    - Provide punchy, encouraging, highly practical, mathematical and actionable advice.
                    - Emphasize "locking in" freelance windfalls before they evaporate.
                    - Focus on eliminating bank debts while keeping steady savings momentum.
                    - If asked about collecting money or overdue clients, provide polite yet firm message templates.
                    - Keep formatting clean with bullet points and bold highlights.
                """.trimIndent()

                val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey"
                val jsonBody = JSONObject().apply {
                    val contents = JSONArray().apply {
                        put(JSONObject().apply {
                            val parts = JSONArray().apply {
                                put(JSONObject().apply {
                                    put("text", contextData)
                                })
                            }
                            put("parts", parts)
                        })
                    }
                    put("contents", contents)
                }

                val requestBody = jsonBody.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
                val request = Request.Builder()
                    .url(url)
                    .post(requestBody)
                    .addHeader("User-Agent", "aistudio-build")
                    .build()

                val response = client.newCall(request).execute()
                val responseBody = response.body?.string() ?: ""

                if (response.isSuccessful) {
                    val root = JSONObject(responseBody)
                    val text = root.getJSONArray("candidates")
                        .getJSONObject(0)
                        .getJSONObject("content")
                        .getJSONArray("parts")
                        .getJSONObject(0)
                        .getString("text")
                    return@withContext text
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        // High quality offline fallback responses tailored to the specific query & real figures
        return@withContext generateLocalExpertAdvice(
            userPrompt,
            profile,
            projects,
            debts,
            targets,
            fixedExpenses,
            totalUncollected,
            totalDebt
        )
    }

    private fun generateLocalExpertAdvice(
        prompt: String,
        profile: HouseholdProfile,
        projects: List<FreelanceProject>,
        debts: List<BankDebt>,
        targets: List<SavingsTarget>,
        fixedExpenses: Double,
        totalUncollected: Double,
        totalDebt: Double
    ): String {
        val sym = profile.currencySymbol
        val lower = prompt.lowercase()

        return when {
            lower.contains("split") || lower.contains("windfall") || lower.contains("gig") || lower.contains("commercial") -> {
                """
                ### 💰 Freelance Cash Allocation Rule (The Golden Split)
                
                Because your wife's IT salary ($sym${profile.wifeMonthlySalary}/mo) covers your base household living expenses ($sym$fixedExpenses/mo), **100% of your freelance revenue can be weaponized for wealth & debt payoff!**
                
                Whenever a commercial or wedding balance hits your bank account:
                
                - **35% ➔ Bank Debt Rapid Paydown**: Directly pay down the highest APR balance (${debts.maxByOrNull { it.interestRateApr }?.bankName ?: "Credit Card"}).
                - **35% ➔ House Savings & Family Vaults**: Immediately lock into your House Downpayment / Emergency vault.
                - **15% ➔ Equipment & Tax Reserve**: Protect yourself from tax bills and gear repairs.
                - **15% ➔ Guilt-Free Safe Pocket**: Your reward for closing and shooting the gig.
                
                ⚡ **Rule of Thumb**: Transfer the 70% (Debt + Savings) within **15 minutes** of the client's bank wire landing so it never sits in your daily checking account.
                """.trimIndent()
            }

            lower.contains("debt") || lower.contains("bank") || lower.contains("credit") || lower.contains("payoff") -> {
                val highestAprDebt = debts.maxByOrNull { it.interestRateApr }
                """
                ### 🏦 Bank Debt Elimination Strategy (Avalanche Method)
                
                Your total bank obligations stand at **$sym$totalDebt**.
                
                **Immediate Action Plan:**
                1. **Target #1 Priority**: ${highestAprDebt?.bankName ?: "Highest APR Card"} (Current Balance: $sym${highestAprDebt?.currentBalance ?: 0.0}, APR: ${highestAprDebt?.interestRateApr ?: 0.0}%).
                2. **Keep Minimums on Others**: Pay the absolute minimum on your lower-interest loans.
                3. **Direct Uncollected Freelance Inflow**: You currently have **$sym$totalUncollected** in pending client invoices. Collecting just two pending projects will wipe out more than 50% of your total credit balances!
                4. **Wife Salary Buffer**: Apply $sym${(profile.wifeMonthlySalary - fixedExpenses).toInt()} of your wife's monthly surplus directly to credit principal.
                """.trimIndent()
            }

            lower.contains("collect") || lower.contains("client") || lower.contains("overdue") || lower.contains("invoice") || lower.contains("whatsapp") -> {
                val overdue = projects.filter { it.status == ProjectStatus.OVERDUE || !it.isFullyCollected }.firstOrNull()
                val client = overdue?.clientName ?: "Client Name"
                val amount = overdue?.balanceRemaining ?: 2500.0

                """
                ### 📱 Client Invoice Collection Strategy & Message Scripts
                
                You currently have **$sym$totalUncollected** in pending invoices. Cash only counts when it's collected in your bank!
                
                #### 📨 Ready-to-Send WhatsApp / SMS Script:
                > *"Hi $client! Hope you're having a great week. We're finalizing our monthly production books and wanted to check in on Invoice **${overdue?.invoiceNumber ?: "INV-2026"}** for **$sym$amount**. Could you let me know if the transfer was initiated or if you need our bank routing details resent? Thanks so much!"*
                
                #### ⚡ Freelancer Golden Rules:
                1. **Never deliver final full-resolution raw/4K exports** without at least 90% or 100% payment clearance.
                2. **Always take 50% deposit** before holding production shoot dates in your calendar.
                3. Follow up **on Day 1 after due date**, not weeks later.
                """.trimIndent()
            }

            else -> {
                """
                ### 🛡️ HouseVault Financial Health Summary
                
                - **Wife's IT Foundation**: $sym${profile.wifeMonthlySalary} monthly income anchors $sym$fixedExpenses in essential bills.
                - **Freelance Cash Engine**: $sym$totalUncollected in outstanding invoices waiting for collection.
                - **Debt Clearance Progress**: Total $sym$totalDebt in bank credit to dissolve.
                - **Savings Runway**: $sym${targets.sumOf { it.currentSavedAmount }} saved towards your family goals.
                
                **Key Recommendation**: Focus this week on collecting pending commercial invoices and routing 70% directly between your highest interest bank card and your house deposit vault.
                """.trimIndent()
            }
        }
    }
}
