package com.example.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.components.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.HouseVaultViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BankDebtScreen(viewModel: HouseVaultViewModel) {
    val context = LocalContext.current
    val profile by viewModel.profile.collectAsState()
    val debts by viewModel.debts.collectAsState()
    val projects by viewModel.projects.collectAsState()
    val sym = profile.currencySymbol

    var strategy by remember { mutableStateOf("AVALANCHE") } // AVALANCHE (Highest APR) vs SNOWBALL (Smallest Balance)
    var showAddDialog by remember { mutableStateOf(false) }
    var editingDebt by remember { mutableStateOf<BankDebt?>(null) }
    var payDebtTarget by remember { mutableStateOf<BankDebt?>(null) }
    var payAmountInput by remember { mutableStateOf("") }

    val totalDebt = debts.sumOf { it.currentBalance }
    val totalOriginalDebt = debts.sumOf { it.originalBalance }
    val totalPaidSoFar = (totalOriginalDebt - totalDebt).coerceAtLeast(0.0)
    val overallProgress = if (totalOriginalDebt > 0) (totalPaidSoFar / totalOriginalDebt).toFloat() else 0f

    val sortedDebts = remember(debts, strategy) {
        if (strategy == "AVALANCHE") {
            debts.sortedByDescending { it.interestRateApr }
        } else {
            debts.sortedBy { it.currentBalance }
        }
    }

    val uncollectedFreelance = projects.filterNot { it.isFullyCollected }.sumOf { it.balanceRemaining }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = Rose600,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Bank Credit")
            }
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Text(
                    text = "Bank Debt Clearance Engine",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    text = "Systematically eliminate bank loans with freelance windfalls",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // --- HERO CARD: TOTAL DEBT & PAYOFF PROGRESS ---
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Total Bank Balance Owed", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                Text(
                                    text = formatMoneyInt(totalDebt, sym),
                                    style = MaterialTheme.typography.headlineMedium,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = if (totalDebt > 0) Rose600 else Emerald600
                                )
                            }

                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (totalDebt > 0) Rose50 else Emerald50
                            ) {
                                Text(
                                    text = "${debts.size} Bank Accounts",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = if (totalDebt > 0) Rose700 else Emerald700,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        AnimatedProgressBar(
                            progress = overallProgress,
                            barColor = Emerald500,
                            height = 10
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Paid: ${formatMoneyInt(totalPaidSoFar, sym)} (${(overallProgress * 100).toInt()}%)",
                                style = MaterialTheme.typography.labelSmall,
                                color = Emerald700,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "Original: ${formatMoneyInt(totalOriginalDebt, sym)}",
                                style = MaterialTheme.typography.labelSmall,
                                color = Slate500
                            )
                        }
                    }
                }
            }

            // --- STRATEGY TOGGLE & FREELANCE ACCELERATOR INSIGHT ---
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Payoff Priority Method:", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                FilterChip(
                                    selected = strategy == "AVALANCHE",
                                    onClick = { strategy = "AVALANCHE" },
                                    label = { Text("Avalanche (High APR)", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                                )
                                FilterChip(
                                    selected = strategy == "SNOWBALL",
                                    onClick = { strategy = "SNOWBALL" },
                                    label = { Text("Snowball (Small Balance)", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = if (strategy == "AVALANCHE")
                                "🎯 Avalanche targets the highest APR debt first (${sortedDebts.firstOrNull()?.bankName ?: "Top Card"} at ${sortedDebts.firstOrNull()?.interestRateApr ?: 0}%), saving maximum bank interest fees."
                            else
                                "⚡ Snowball focuses on clearing the smallest balance first (${sortedDebts.firstOrNull()?.bankName ?: "Top Card"} at ${formatMoney(sortedDebts.firstOrNull()?.currentBalance ?: 0.0, sym)}), providing instant psychological momentum.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // --- LIST OF BANK DEBTS ---
            item {
                SectionHeader(
                    title = "Active Bank Debts (${sortedDebts.size})",
                    subtitle = "Ranked in recommended payoff order"
                )
            }

            if (sortedDebts.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Emerald500, modifier = Modifier.size(48.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("You are 100% Debt Free!", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            Text("All bank credits and personal loans are paid off.", style = MaterialTheme.typography.bodySmall, color = Slate500)
                        }
                    }
                }
            } else {
                items(sortedDebts) { debt ->
                    val isTopPriority = debt.id == sortedDebts.first().id && debt.currentBalance > 0

                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isTopPriority) MaterialTheme.colorScheme.surface else MaterialTheme.colorScheme.surface
                        ),
                        elevation = CardDefaults.cardElevation(defaultElevation = if (isTopPriority) 4.dp else 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.Top
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    if (isTopPriority) {
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = Rose100
                                        ) {
                                            Text(
                                                text = "🔥 #1 PAYOFF PRIORITY",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = Rose700,
                                                fontWeight = FontWeight.ExtraBold,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(4.dp))
                                    }

                                    Text(
                                        text = debt.bankName,
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "${debt.debtType.label} • APR: ${debt.interestRateApr}% • Due day ${debt.dueDayOfMonth}th",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }

                                Column(horizontalAlignment = Alignment.End) {
                                    Text("Balance", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                    Text(
                                        text = formatMoney(debt.currentBalance, sym),
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = if (debt.currentBalance > 0) Rose600 else Emerald600
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            AnimatedProgressBar(
                                progress = debt.progressPercent,
                                barColor = if (debt.currentBalance == 0.0) Emerald500 else Rose500
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Min Payment: ${formatMoney(debt.minMonthlyPayment, sym)}/mo", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                Text("Target Payment: ${formatMoney(debt.targetMonthlyPayment, sym)}/mo", style = MaterialTheme.typography.labelSmall, color = Slate700, fontWeight = FontWeight.Bold)
                            }

                            if (debt.notes.isNotBlank()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "💡 ${debt.notes}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                if (debt.currentBalance > 0) {
                                    Button(
                                        onClick = {
                                            payDebtTarget = debt
                                            payAmountInput = (debt.targetMonthlyPayment).toString()
                                        },
                                        modifier = Modifier.weight(1f),
                                        colors = ButtonDefaults.buttonColors(containerColor = Rose600),
                                        shape = RoundedCornerShape(10.dp)
                                    ) {
                                        Icon(Icons.Default.Payment, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Pay Down", fontWeight = FontWeight.Bold)
                                    }
                                }

                                IconButton(onClick = { editingDebt = debt }) {
                                    Icon(Icons.Outlined.Edit, contentDescription = "Edit", tint = Slate500)
                                }

                                IconButton(onClick = { viewModel.deleteDebt(debt.id) }) {
                                    Icon(Icons.Outlined.Delete, contentDescription = "Delete", tint = Rose500)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // --- MAKE DEBT PAYMENT MODAL ---
    if (payDebtTarget != null) {
        val debt = payDebtTarget!!
        AlertDialog(
            onDismissRequest = { payDebtTarget = null },
            title = {
                Text("Pay Down: ${debt.bankName}", fontWeight = FontWeight.Bold)
            },
            text = {
                Column {
                    Text("Current Balance: ${formatMoney(debt.currentBalance, sym)}", fontWeight = FontWeight.Bold, color = Rose600)
                    Text("Interest Rate: ${debt.interestRateApr}% APR")

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = payAmountInput,
                        onValueChange = { payAmountInput = it },
                        label = { Text("Payment Amount ($sym)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        FilterChip(
                            selected = payAmountInput == debt.minMonthlyPayment.toString(),
                            onClick = { payAmountInput = debt.minMonthlyPayment.toString() },
                            label = { Text("Min (${formatMoneyInt(debt.minMonthlyPayment, sym)})") }
                        )
                        FilterChip(
                            selected = payAmountInput == debt.targetMonthlyPayment.toString(),
                            onClick = { payAmountInput = debt.targetMonthlyPayment.toString() },
                            label = { Text("Target (${formatMoneyInt(debt.targetMonthlyPayment, sym)})") }
                        )
                        FilterChip(
                            selected = payAmountInput == debt.currentBalance.toString(),
                            onClick = { payAmountInput = debt.currentBalance.toString() },
                            label = { Text("Pay All") }
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amt = payAmountInput.toDoubleOrNull() ?: 0.0
                        if (amt > 0) {
                            viewModel.payDebt(debt.id, amt)
                            Toast.makeText(context, "Payment of ${formatMoney(amt, sym)} applied!", Toast.LENGTH_SHORT).show()
                        }
                        payDebtTarget = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Rose600)
                ) {
                    Text("Record Payment")
                }
            },
            dismissButton = {
                TextButton(onClick = { payDebtTarget = null }) {
                    Text("Cancel")
                }
            }
        )
    }

    // --- ADD / EDIT DEBT DIALOG ---
    if (showAddDialog || editingDebt != null) {
        val isEditing = editingDebt != null
        val existing = editingDebt

        var bankName by remember { mutableStateOf(existing?.bankName ?: "") }
        var debtType by remember { mutableStateOf(existing?.debtType ?: DebtType.CREDIT_CARD) }
        var currentBalance by remember { mutableStateOf(existing?.currentBalance?.toString() ?: "") }
        var interestApr by remember { mutableStateOf(existing?.interestRateApr?.toString() ?: "18.5") }
        var minPayment by remember { mutableStateOf(existing?.minMonthlyPayment?.toString() ?: "150") }
        var targetPayment by remember { mutableStateOf(existing?.targetMonthlyPayment?.toString() ?: "400") }
        var dueDay by remember { mutableStateOf(existing?.dueDayOfMonth?.toString() ?: "15") }
        var notes by remember { mutableStateOf(existing?.notes ?: "") }

        AlertDialog(
            onDismissRequest = {
                showAddDialog = false
                editingDebt = null
            },
            title = {
                Text(if (isEditing) "Edit Bank Debt" else "Add Bank Debt / Credit Line", fontWeight = FontWeight.Bold)
            },
            text = {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        OutlinedTextField(
                            value = bankName,
                            onValueChange = { bankName = it },
                            label = { Text("Bank / Account Name *") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = currentBalance,
                                onValueChange = { currentBalance = it },
                                label = { Text("Balance Owed ($sym) *") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = interestApr,
                                onValueChange = { interestApr = it },
                                label = { Text("APR Rate (%) *") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                    item {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = minPayment,
                                onValueChange = { minPayment = it },
                                label = { Text("Min Monthly ($sym)") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = targetPayment,
                                onValueChange = { targetPayment = it },
                                label = { Text("Target Monthly ($sym)") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                    item {
                        OutlinedTextField(
                            value = dueDay,
                            onValueChange = { dueDay = it },
                            label = { Text("Payment Due Day (1-31)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = notes,
                            onValueChange = { notes = it },
                            label = { Text("Notes (e.g. equipment loan, credit limit)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val bal = currentBalance.toDoubleOrNull() ?: 0.0
                        val apr = interestApr.toDoubleOrNull() ?: 0.0
                        val minP = minPayment.toDoubleOrNull() ?: 0.0
                        val tarP = targetPayment.toDoubleOrNull() ?: minP
                        val day = dueDay.toIntOrNull() ?: 15

                        if (bankName.isNotBlank() && bal > 0) {
                            if (isEditing && existing != null) {
                                viewModel.updateDebt(
                                    existing.copy(
                                        bankName = bankName,
                                        debtType = debtType,
                                        currentBalance = bal,
                                        interestRateApr = apr,
                                        minMonthlyPayment = minP,
                                        targetMonthlyPayment = tarP,
                                        dueDayOfMonth = day,
                                        notes = notes
                                    )
                                )
                            } else {
                                viewModel.addDebt(bankName, debtType, bal, apr, minP, tarP, day, notes)
                            }
                        }
                        showAddDialog = false
                        editingDebt = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Rose600)
                ) {
                    Text(if (isEditing) "Save" else "Add Debt")
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    showAddDialog = false
                    editingDebt = null
                }) {
                    Text("Cancel")
                }
            }
        )
    }
}
