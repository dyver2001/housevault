package com.example.ui.screens

import android.widget.Toast
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
fun SavingsTargetsScreen(viewModel: HouseVaultViewModel) {
    val context = LocalContext.current
    val profile by viewModel.profile.collectAsState()
    val targets by viewModel.targets.collectAsState()
    val sym = profile.currencySymbol

    var showAddDialog by remember { mutableStateOf(false) }
    var editingTarget by remember { mutableStateOf<SavingsTarget?>(null) }
    var depositTarget by remember { mutableStateOf<SavingsTarget?>(null) }
    var depositAmountInput by remember { mutableStateOf("") }

    val totalSaved = targets.sumOf { it.currentSavedAmount }
    val totalGoal = targets.sumOf { it.targetAmount }
    val overallProgress = if (totalGoal > 0) (totalSaved / totalGoal).toFloat() else 0f

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = Amber500,
                contentColor = Slate900
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Savings Target")
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
                    text = "Savings Targets & House Goals",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    text = "Lock in freelance windfalls towards your family's future",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // --- HERO TOTAL SAVINGS ACCUMULATOR ---
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
                                Text("Total Saved in Vaults", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                Text(
                                    text = formatMoneyInt(totalSaved, sym),
                                    style = MaterialTheme.typography.headlineMedium,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Emerald700
                                )
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text("Total Target Goal", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                Text(
                                    text = formatMoneyInt(totalGoal, sym),
                                    style = MaterialTheme.typography.titleLarge,
                                    fontWeight = FontWeight.Bold,
                                    color = Slate700
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        AnimatedProgressBar(
                            progress = overallProgress,
                            barColor = Amber500,
                            height = 10
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "${(overallProgress * 100).toInt()}% Total Goal Reached",
                                style = MaterialTheme.typography.labelSmall,
                                color = Amber700,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${formatMoneyInt((totalGoal - totalSaved).coerceAtLeast(0.0), sym)} to go",
                                style = MaterialTheme.typography.labelSmall,
                                color = Slate500
                            )
                        }
                    }
                }
            }

            // --- TARGET CARDS ---
            item {
                SectionHeader(
                    title = "Family Vaults & Targets (${targets.size})",
                    subtitle = "Dedicated cash envelopes for peace of mind"
                )
            }

            items(targets) { target ->
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
                            verticalAlignment = Alignment.Top
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.weight(1f)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(42.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Amber100),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = when (target.iconName) {
                                            "home" -> Icons.Default.Home
                                            "shield" -> Icons.Default.Security
                                            "camera" -> Icons.Default.Videocam
                                            "airplane" -> Icons.Default.Flight
                                            else -> Icons.Default.Savings
                                        },
                                        contentDescription = null,
                                        tint = Amber700,
                                        modifier = Modifier.size(24.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column {
                                    Text(
                                        text = target.title,
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "${target.category} • Target Date: ${target.deadline}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = when (target.priority) {
                                    TargetPriority.CRITICAL -> Rose50
                                    TargetPriority.MEDIUM -> Amber50
                                    TargetPriority.FLEXIBLE -> Emerald50
                                }
                            ) {
                                Text(
                                    text = target.priority.label,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = when (target.priority) {
                                        TargetPriority.CRITICAL -> Rose700
                                        TargetPriority.MEDIUM -> Amber700
                                        TargetPriority.FLEXIBLE -> Emerald700
                                    },
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Current Saved", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                Text(
                                    text = formatMoney(target.currentSavedAmount, sym),
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald700
                                )
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text("Goal Target", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                Text(
                                    text = formatMoney(target.targetAmount, sym),
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        AnimatedProgressBar(
                            progress = target.progressPercent,
                            barColor = if (target.progressPercent >= 1f) Emerald500 else Amber500
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "${(target.progressPercent * 100).toInt()}% completed",
                                style = MaterialTheme.typography.labelSmall,
                                color = Amber700,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${formatMoney(target.remainingAmount, sym)} remaining",
                                style = MaterialTheme.typography.labelSmall,
                                color = Slate500
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = {
                                    depositTarget = target
                                    depositAmountInput = "500"
                                },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(containerColor = Amber500, contentColor = Slate900),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Deposit Money", fontWeight = FontWeight.Bold)
                            }

                            IconButton(onClick = { editingTarget = target }) {
                                Icon(Icons.Outlined.Edit, contentDescription = "Edit", tint = Slate500)
                            }

                            IconButton(onClick = { viewModel.deleteTarget(target.id) }) {
                                Icon(Icons.Outlined.Delete, contentDescription = "Delete", tint = Rose500)
                            }
                        }
                    }
                }
            }
        }
    }

    // --- DEPOSIT MONEY MODAL ---
    if (depositTarget != null) {
        val target = depositTarget!!
        AlertDialog(
            onDismissRequest = { depositTarget = null },
            title = {
                Text("Deposit to ${target.title}", fontWeight = FontWeight.Bold)
            },
            text = {
                Column {
                    Text("Current in Vault: ${formatMoney(target.currentSavedAmount, sym)}", fontWeight = FontWeight.Bold, color = Emerald700)
                    Text("Target Goal: ${formatMoney(target.targetAmount, sym)}")

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = depositAmountInput,
                        onValueChange = { depositAmountInput = it },
                        label = { Text("Deposit Amount ($sym)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        listOf("250", "500", "1000", "2000").forEach { preset ->
                            FilterChip(
                                selected = depositAmountInput == preset,
                                onClick = { depositAmountInput = preset },
                                label = { Text("+$preset") }
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amt = depositAmountInput.toDoubleOrNull() ?: 0.0
                        if (amt > 0) {
                            viewModel.depositToTarget(target.id, amt)
                            Toast.makeText(context, "Deposited ${formatMoney(amt, sym)} to ${target.title}!", Toast.LENGTH_SHORT).show()
                        }
                        depositTarget = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Amber500, contentColor = Slate900)
                ) {
                    Text("Confirm Deposit", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { depositTarget = null }) {
                    Text("Cancel")
                }
            }
        )
    }

    // --- ADD / EDIT TARGET DIALOG ---
    if (showAddDialog || editingTarget != null) {
        val isEditing = editingTarget != null
        val existing = editingTarget

        var title by remember { mutableStateOf(existing?.title ?: "") }
        var targetAmount by remember { mutableStateOf(existing?.targetAmount?.toString() ?: "") }
        var currentSaved by remember { mutableStateOf(existing?.currentSavedAmount?.toString() ?: "0") }
        var priority by remember { mutableStateOf(existing?.priority ?: TargetPriority.CRITICAL) }
        var category by remember { mutableStateOf(existing?.category ?: "House & Family") }
        var deadline by remember { mutableStateOf(existing?.deadline ?: "Dec 2027") }
        var iconName by remember { mutableStateOf(existing?.iconName ?: "home") }

        AlertDialog(
            onDismissRequest = {
                showAddDialog = false
                editingTarget = null
            },
            title = {
                Text(if (isEditing) "Edit Savings Goal" else "New Savings Target / Vault", fontWeight = FontWeight.Bold)
            },
            text = {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        OutlinedTextField(
                            value = title,
                            onValueChange = { title = it },
                            label = { Text("Goal Title (e.g. House Downpayment, Sony FX3) *") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = targetAmount,
                                onValueChange = { targetAmount = it },
                                label = { Text("Target Amount ($sym) *") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = currentSaved,
                                onValueChange = { currentSaved = it },
                                label = { Text("Already Saved ($sym)") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                    item {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = category,
                                onValueChange = { category = it },
                                label = { Text("Category") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = deadline,
                                onValueChange = { deadline = it },
                                label = { Text("Target Date") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                    item {
                        Text("Goal Priority:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            TargetPriority.values().forEach { p ->
                                FilterChip(
                                    selected = priority == p,
                                    onClick = { priority = p },
                                    label = { Text(p.label, fontSize = 11.sp) }
                                )
                            }
                        }
                    }
                    item {
                        Text("Icon:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf("home" to "Home", "shield" to "Emergency", "camera" to "Gear", "airplane" to "Vacation").forEach { (ic, label) ->
                                FilterChip(
                                    selected = iconName == ic,
                                    onClick = { iconName = ic },
                                    label = { Text(label) }
                                )
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val tar = targetAmount.toDoubleOrNull() ?: 0.0
                        val cur = currentSaved.toDoubleOrNull() ?: 0.0
                        if (title.isNotBlank() && tar > 0) {
                            if (isEditing && existing != null) {
                                viewModel.updateTarget(
                                    existing.copy(
                                        title = title,
                                        targetAmount = tar,
                                        currentSavedAmount = cur,
                                        priority = priority,
                                        category = category,
                                        deadline = deadline,
                                        iconName = iconName
                                    )
                                )
                            } else {
                                viewModel.addTarget(title, tar, cur, priority, category, deadline, iconName)
                            }
                        }
                        showAddDialog = false
                        editingTarget = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Amber500, contentColor = Slate900)
                ) {
                    Text(if (isEditing) "Save Goal" else "Create Vault", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    showAddDialog = false
                    editingTarget = null
                }) {
                    Text("Cancel")
                }
            }
        )
    }
}
