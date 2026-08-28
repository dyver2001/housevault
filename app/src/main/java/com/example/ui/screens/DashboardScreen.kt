package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.components.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.AppTab
import com.example.ui.viewmodel.HouseVaultViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    viewModel: HouseVaultViewModel,
    onNavigate: (AppTab) -> Unit
) {
    val profile by viewModel.profile.collectAsState()
    val projects by viewModel.projects.collectAsState()
    val debts by viewModel.debts.collectAsState()
    val targets by viewModel.targets.collectAsState()
    val expenses by viewModel.expenses.collectAsState()
    val splitRule by viewModel.splitRule.collectAsState()

    val sym = profile.currencySymbol
    val uncollectedProjects = projects.filterNot { it.isFullyCollected }
    val totalUncollected = uncollectedProjects.sumOf { it.balanceRemaining }
    val totalDebt = debts.sumOf { it.currentBalance }
    val totalSaved = targets.sumOf { it.currentSavedAmount }
    val totalTargetsGoal = targets.sumOf { it.targetAmount }
    val fixedBills = expenses.filter { it.isFixed }.sumOf { it.amount }
    val wifeSalarySurplus = (profile.wifeMonthlySalary - fixedBills).coerceAtLeast(0.0)

    // Interactive Windfall Splitter state
    var simulatedGigAmount by remember { mutableStateOf("3500") }
    var collectDialogProject by remember { mutableStateOf<FreelanceProject?>(null) }
    var collectAmountInput by remember { mutableStateOf("") }
    var autoSplitChecked by remember { mutableStateOf(true) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 90.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // --- HERO: FREELANCE CASH COLLECTOR BANNER ---
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.Transparent)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            brush = Brush.horizontalGradient(
                                colors = listOf(Emerald900, Emerald700)
                            )
                        )
                        .padding(20.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "UNCOLLECTED FREELANCE MONEY",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = Emerald100,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp
                                )
                                Text(
                                    text = formatMoneyInt(totalUncollected, sym),
                                    style = MaterialTheme.typography.headlineLarge,
                                    color = Color.White,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }

                            Button(
                                onClick = { onNavigate(AppTab.COLLECTOR) },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Amber500,
                                    contentColor = Slate900
                                ),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Default.AttachMoney, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Collect Now", fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Color(0x33000000)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 12.dp, vertical = 8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.PendingActions,
                                        contentDescription = null,
                                        tint = Amber400,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "${uncollectedProjects.size} pending invoices waiting for payment",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = Emerald50
                                    )
                                }

                                Text(
                                    text = "View List →",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Amber400,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.clickable { onNavigate(AppTab.COLLECTOR) }
                                )
                            }
                        }
                    }
                }
            }
        }

        // --- HOUSEHOLD DUAL-INCOME FOUNDATION PILL ---
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0xFFEDE9FE)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Security, contentDescription = null, tint = Color(0xFF7C3AED), modifier = Modifier.size(20.dp))
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "Spouse IT Salary Base",
                                    style = MaterialTheme.typography.titleSmall,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "Elena covers 100% of Fixed Living Costs",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Emerald100
                        ) {
                            Text(
                                text = "100% Covered ✅",
                                style = MaterialTheme.typography.labelSmall,
                                color = Emerald800,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("IT Salary", style = MaterialTheme.typography.labelSmall, color = Slate500)
                            Text(formatMoneyInt(profile.wifeMonthlySalary, sym), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        }
                        Column {
                            Text("Fixed Bills", style = MaterialTheme.typography.labelSmall, color = Slate500)
                            Text(formatMoneyInt(fixedBills, sym), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        }
                        Column {
                            Text("Monthly Surplus", style = MaterialTheme.typography.labelSmall, color = Slate500)
                            Text(formatMoneyInt(wifeSalarySurplus, sym), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = Emerald600)
                        }
                    }
                }
            }
        }

        // --- 2x2 METRICS GRID ---
        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                MetricCard(
                    title = "Bank Debts",
                    value = formatMoneyInt(totalDebt, sym),
                    subtitle = "${debts.size} active credits",
                    icon = Icons.Outlined.CreditCard,
                    iconBgColor = Rose50,
                    iconColor = Rose600,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(AppTab.BANK_DEBT) }
                )
                MetricCard(
                    title = "Savings Goals",
                    value = formatMoneyInt(totalSaved, sym),
                    subtitle = "of ${formatMoneyInt(totalTargetsGoal, sym)} target",
                    icon = Icons.Outlined.Savings,
                    iconBgColor = Amber50,
                    iconColor = Amber600,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(AppTab.TARGETS) }
                )
            }
        }

        // --- WINDFALL SPLITTER SIMULATOR (THE CORE WEALTH HABIT) ---
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "⚡ Freelance Windfall Splitter",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Never let commercial gig money slip away",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        IconButton(onClick = { onNavigate(AppTab.AI_ADVISOR) }) {
                            Icon(Icons.Outlined.AutoAwesome, contentDescription = "AI Advice", tint = Amber600)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = simulatedGigAmount,
                        onValueChange = { simulatedGigAmount = it },
                        label = { Text("Enter Incoming Freelance Check ($sym)") },
                        leadingIcon = { Text(sym, fontWeight = FontWeight.Bold, modifier = Modifier.padding(start = 12.dp)) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    val gigAmountNum = simulatedGigAmount.toDoubleOrNull() ?: 0.0
                    val splits = splitRule.calculateSplit(gigAmountNum)

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Instant 15-Minute Allocation Rules:",
                        style = MaterialTheme.typography.labelSmall,
                        color = Slate500,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        // 35% Debt
                        Surface(
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            color = Rose50
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text("Bank Debt (${splitRule.debtPayoffPercent}%)", style = MaterialTheme.typography.labelSmall, color = Rose700, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(formatMoneyInt(splits["debt"] ?: 0.0, sym), style = MaterialTheme.typography.titleSmall, color = Rose700, fontWeight = FontWeight.ExtraBold)
                            }
                        }

                        // 35% Savings
                        Surface(
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            color = Emerald50
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text("House Vault (${splitRule.savingsTargetPercent}%)", style = MaterialTheme.typography.labelSmall, color = Emerald700, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(formatMoneyInt(splits["savings"] ?: 0.0, sym), style = MaterialTheme.typography.titleSmall, color = Emerald700, fontWeight = FontWeight.ExtraBold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        // 15% Tax & Gear
                        Surface(
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            color = Slate100
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text("Tax/Gear (${splitRule.businessTaxReservePercent}%)", style = MaterialTheme.typography.labelSmall, color = Slate700, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(formatMoneyInt(splits["taxReserve"] ?: 0.0, sym), style = MaterialTheme.typography.titleSmall, color = Slate900, fontWeight = FontWeight.Bold)
                            }
                        }

                        // 15% Safe Pocket
                        Surface(
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            color = Amber50
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text("Safe Pocket (${splitRule.safePocketPercent}%)", style = MaterialTheme.typography.labelSmall, color = Amber700, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(formatMoneyInt(splits["safePocket"] ?: 0.0, sym), style = MaterialTheme.typography.titleSmall, color = Amber700, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // --- URGENT PENDING COLLECTIONS ---
        item {
            SectionHeader(
                title = "🚨 Urgent Invoices to Collect",
                subtitle = "Take action on outstanding balances",
                actionText = "See All (${projects.size})",
                onActionClick = { onNavigate(AppTab.COLLECTOR) }
            )
        }

        if (uncollectedProjects.isEmpty()) {
            item {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Emerald50,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Emerald600)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "All freelance invoices have been collected! Amazing job.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Emerald800,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
        } else {
            items(uncollectedProjects.take(3).size) { index ->
                val project = uncollectedProjects[index]
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = project.clientName,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = project.projectTitle,
                                    style = MaterialTheme.typography.titleSmall,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            StatusBadge(status = project.status)
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Remaining to Collect", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                Text(
                                    text = formatMoney(project.balanceRemaining, sym),
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Emerald700
                                )
                            }

                            Button(
                                onClick = {
                                    collectDialogProject = project
                                    collectAmountInput = project.balanceRemaining.toString()
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                shape = RoundedCornerShape(10.dp),
                                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                            ) {
                                Text("Collect Payment", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }
                    }
                }
            }
        }

        // --- QUICK AI TIP BANNER ---
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigate(AppTab.AI_ADVISOR) },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Slate900)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(Amber500),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Slate900)
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "AI Household Wealth Advisor",
                            style = MaterialTheme.typography.titleSmall,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Ask Gemini how to clear bank debts & reach house target faster",
                            style = MaterialTheme.typography.bodySmall,
                            color = Slate300
                        )
                    }

                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Amber400)
                }
            }
        }
    }

    // --- COLLECT PAYMENT MODAL ---
    if (collectDialogProject != null) {
        val proj = collectDialogProject!!
        AlertDialog(
            onDismissRequest = { collectDialogProject = null },
            title = {
                Text("Collect Money: ${proj.clientName}", fontWeight = FontWeight.Bold)
            },
            text = {
                Column {
                    Text("Total Invoice: ${formatMoney(proj.totalFee, sym)}")
                    Text("Already Received: ${formatMoney(proj.depositReceived, sym)}")
                    Text("Balance Due: ${formatMoney(proj.balanceRemaining, sym)}", fontWeight = FontWeight.Bold, color = Emerald700)

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = collectAmountInput,
                        onValueChange = { collectAmountInput = it },
                        label = { Text("Amount Collected ($sym)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(
                            checked = autoSplitChecked,
                            onCheckedChange = { autoSplitChecked = it }
                        )
                        Text(
                            text = "Auto-allocate 35% to highest Bank Debt and 35% to House Target",
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amt = collectAmountInput.toDoubleOrNull() ?: 0.0
                        if (amt > 0) {
                            viewModel.collectPayment(proj.id, amt, autoSplitChecked)
                        }
                        collectDialogProject = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Text("Confirm Collection")
                }
            },
            dismissButton = {
                TextButton(onClick = { collectDialogProject = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}
