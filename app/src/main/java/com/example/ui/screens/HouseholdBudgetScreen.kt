package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.components.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.HouseVaultViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HouseholdBudgetScreen(viewModel: HouseVaultViewModel) {
    val profile by viewModel.profile.collectAsState()
    val expenses by viewModel.expenses.collectAsState()
    val sym = profile.currencySymbol

    var showAddDialog by remember { mutableStateOf(false) }
    var editingExpense by remember { mutableStateOf<HouseholdExpense?>(null) }
    var filterCategory by remember { mutableStateOf<ExpenseCategory?>(null) }

    val fixedBills = expenses.filter { it.isFixed }.sumOf { it.amount }
    val variableBills = expenses.filter { !it.isFixed }.sumOf { it.amount }
    val totalHouseholdExpenses = expenses.sumOf { it.amount }
    val wifeSalary = profile.wifeMonthlySalary
    val wifeSurplus = (wifeSalary - fixedBills).coerceAtLeast(0.0)

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = Emerald600,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Expense")
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
                    text = "Household Budget & Foundation",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    text = "Spouse IT salary provides stable living security",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // --- IT SALARY VS LIVING EXPENSES RATIO CARD ---
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
                                Text("Wife IT Salary (Elena)", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                Text(formatMoney(wifeSalary, sym), style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = Color(0xFF7C3AED))
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text("Fixed Family Essentials", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                Text(formatMoney(fixedBills, sym), style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = Slate800)
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        val coveragePercent = if (wifeSalary > 0) (fixedBills / wifeSalary).toFloat() else 0f
                        AnimatedProgressBar(
                            progress = coveragePercent,
                            barColor = if (coveragePercent <= 1f) Emerald500 else Rose500,
                            height = 10
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Uses ${(coveragePercent * 100).toInt()}% of base salary",
                                style = MaterialTheme.typography.labelSmall,
                                color = Slate500
                            )
                            Text(
                                text = "+${formatMoney(wifeSurplus, sym)} Monthly Surplus",
                                style = MaterialTheme.typography.labelSmall,
                                color = Emerald600,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // --- SPENDING BREAKDOWN SUMMARY ---
            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    MetricCard(
                        title = "Fixed Living Essentials",
                        value = formatMoneyInt(fixedBills, sym),
                        subtitle = "Rent, food, utilities",
                        icon = Icons.Outlined.Home,
                        iconBgColor = Emerald50,
                        iconColor = Emerald700,
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = "Variable / Freelance",
                        value = formatMoneyInt(variableBills, sym),
                        subtitle = "Gear, subscriptions, leisure",
                        icon = Icons.Outlined.CameraAlt,
                        iconBgColor = Amber50,
                        iconColor = Amber700,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // --- EXPENSES LIST ---
            item {
                SectionHeader(
                    title = "Monthly House Expenses (${expenses.size})",
                    subtitle = "Allocated between salary & freelance pool"
                )
            }

            items(expenses) { expense ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(CircleShape)
                                    .background(
                                        when (expense.assignedPayer) {
                                            ExpensePayer.WIFE_SALARY -> Color(0xFFEDE9FE)
                                            ExpensePayer.FREELANCE_BUFFER -> Amber100
                                            ExpensePayer.SHARED_POOL -> Emerald100
                                        }
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = when (expense.category) {
                                        ExpenseCategory.HOUSING -> Icons.Default.Home
                                        ExpenseCategory.GROCERIES -> Icons.Default.ShoppingCart
                                        ExpenseCategory.UTILITIES -> Icons.Default.Bolt
                                        ExpenseCategory.INTERNET_PHONE -> Icons.Default.Wifi
                                        ExpenseCategory.HEALTH -> Icons.Default.MedicalServices
                                        ExpenseCategory.TRANSPORT -> Icons.Default.DirectionsCar
                                        ExpenseCategory.VIDEO_SOFTWARE -> Icons.Default.VideoLibrary
                                        ExpenseCategory.FAMILY_LEISURE -> Icons.Default.Celebration
                                        ExpenseCategory.MISC -> Icons.Default.Category
                                    },
                                    contentDescription = null,
                                    tint = when (expense.assignedPayer) {
                                        ExpensePayer.WIFE_SALARY -> Color(0xFF7C3AED)
                                        ExpensePayer.FREELANCE_BUFFER -> Amber700
                                        ExpensePayer.SHARED_POOL -> Emerald700
                                    },
                                    modifier = Modifier.size(20.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column {
                                Text(
                                    text = expense.title,
                                    style = MaterialTheme.typography.titleSmall,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "${expense.category.label} • ${expense.assignedPayer.label}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = formatMoney(expense.amount, sym),
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )

                            IconButton(onClick = { editingExpense = expense }) {
                                Icon(Icons.Outlined.Edit, contentDescription = "Edit", tint = Slate500, modifier = Modifier.size(18.dp))
                            }

                            IconButton(onClick = { viewModel.deleteExpense(expense.id) }) {
                                Icon(Icons.Outlined.Delete, contentDescription = "Delete", tint = Rose500, modifier = Modifier.size(18.dp))
                            }
                        }
                    }
                }
            }
        }
    }

    // --- ADD / EDIT EXPENSE DIALOG ---
    if (showAddDialog || editingExpense != null) {
        val isEditing = editingExpense != null
        val existing = editingExpense

        var title by remember { mutableStateOf(existing?.title ?: "") }
        var amount by remember { mutableStateOf(existing?.amount?.toString() ?: "") }
        var category by remember { mutableStateOf(existing?.category ?: ExpenseCategory.HOUSING) }
        var isFixed by remember { mutableStateOf(existing?.isFixed ?: true) }
        var payer by remember { mutableStateOf(existing?.assignedPayer ?: ExpensePayer.WIFE_SALARY) }

        AlertDialog(
            onDismissRequest = {
                showAddDialog = false
                editingExpense = null
            },
            title = {
                Text(if (isEditing) "Edit House Expense" else "Add House Expense", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text("Expense Name (e.g. Rent, Adobe Cloud)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = amount,
                        onValueChange = { amount = it },
                        label = { Text("Monthly Amount ($sym)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Text("Paid By:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        FilterChip(
                            selected = payer == ExpensePayer.WIFE_SALARY,
                            onClick = { payer = ExpensePayer.WIFE_SALARY },
                            label = { Text("Wife Salary", fontSize = 11.sp) }
                        )
                        FilterChip(
                            selected = payer == ExpensePayer.FREELANCE_BUFFER,
                            onClick = { payer = ExpensePayer.FREELANCE_BUFFER },
                            label = { Text("Freelance", fontSize = 11.sp) }
                        )
                        FilterChip(
                            selected = payer == ExpensePayer.SHARED_POOL,
                            onClick = { payer = ExpensePayer.SHARED_POOL },
                            label = { Text("Shared", fontSize = 11.sp) }
                        )
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(checked = isFixed, onCheckedChange = { isFixed = it })
                        Text("Fixed essential bill (must be paid every month)", style = MaterialTheme.typography.bodySmall)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amt = amount.toDoubleOrNull() ?: 0.0
                        if (title.isNotBlank() && amt > 0) {
                            if (isEditing && existing != null) {
                                viewModel.updateExpense(
                                    existing.copy(title = title, amount = amt, category = category, isFixed = isFixed, assignedPayer = payer)
                                )
                            } else {
                                viewModel.addExpense(title, amt, category, isFixed, payer)
                            }
                        }
                        showAddDialog = false
                        editingExpense = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Text(if (isEditing) "Save" else "Add")
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    showAddDialog = false
                    editingExpense = null
                }) {
                    Text("Cancel")
                }
            }
        )
    }
}
