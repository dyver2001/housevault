package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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
fun FreelanceCollectorScreen(viewModel: HouseVaultViewModel) {
    val context = LocalContext.current
    val profile by viewModel.profile.collectAsState()
    val projects by viewModel.projects.collectAsState()
    val sym = profile.currencySymbol

    var selectedFilter by remember { mutableStateOf("ALL") } // ALL, PENDING, OVERDUE, COLLECTED
    var showAddDialog by remember { mutableStateOf(false) }
    var editingProject by remember { mutableStateOf<FreelanceProject?>(null) }
    var reminderProject by remember { mutableStateOf<FreelanceProject?>(null) }
    var collectProject by remember { mutableStateOf<FreelanceProject?>(null) }
    var collectAmountInput by remember { mutableStateOf("") }
    var autoSplitChecked by remember { mutableStateOf(true) }

    val filteredProjects = when (selectedFilter) {
        "PENDING" -> projects.filter { !it.isFullyCollected && it.status != ProjectStatus.OVERDUE }
        "OVERDUE" -> projects.filter { it.status == ProjectStatus.OVERDUE }
        "COLLECTED" -> projects.filter { it.isFullyCollected }
        else -> projects
    }

    val totalPendingAmount = projects.filterNot { it.isFullyCollected }.sumOf { it.balanceRemaining }
    val totalCollectedAmount = projects.sumOf { it.depositReceived }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = Emerald600,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Freelance Gig")
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
            // Header summary
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Freelance Cash Collector",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = "Track videography gigs & collect every dollar",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Emerald50
                    ) {
                        Column(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            horizontalAlignment = Alignment.End
                        ) {
                            Text("To Collect", style = MaterialTheme.typography.labelSmall, color = Emerald800)
                            Text(formatMoneyInt(totalPendingAmount, sym), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = Emerald700)
                        }
                    }
                }
            }

            // Filter Chips
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    val filters = listOf(
                        "ALL" to "All Gigs (${projects.size})",
                        "OVERDUE" to "Overdue (${projects.count { it.status == ProjectStatus.OVERDUE }})",
                        "PENDING" to "Pending (${projects.count { !it.isFullyCollected && it.status != ProjectStatus.OVERDUE }})",
                        "COLLECTED" to "Collected (${projects.count { it.isFullyCollected }})"
                    )

                    items(filters) { (key, label) ->
                        FilterChip(
                            selected = selectedFilter == key,
                            onClick = { selectedFilter = key },
                            label = { Text(label, fontWeight = if (selectedFilter == key) FontWeight.Bold else FontWeight.Normal) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = if (key == "OVERDUE") Rose100 else Emerald100,
                                selectedLabelColor = if (key == "OVERDUE") Rose700 else Emerald900
                            )
                        )
                    }
                }
            }

            // List of projects
            if (filteredProjects.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(Icons.Outlined.Videocam, contentDescription = null, modifier = Modifier.size(48.dp), tint = Slate400)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("No gigs in this category", fontWeight = FontWeight.Bold)
                            Text("Tap the + button below to log a new client video project", style = MaterialTheme.typography.bodySmall, color = Slate500)
                        }
                    }
                }
            } else {
                items(filteredProjects) { project ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            // Top row: Client & Status / Action icons
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.Top
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = project.clientName,
                                        style = MaterialTheme.typography.labelMedium,
                                        color = MaterialTheme.colorScheme.primary,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = project.projectTitle,
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "${project.category.label} • ${project.invoiceNumber}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(2.dp)
                                ) {
                                    StatusBadge(status = project.status)
                                    IconButton(
                                        onClick = { editingProject = project },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(Icons.Outlined.Edit, contentDescription = "Edit", tint = Slate400, modifier = Modifier.size(16.dp))
                                    }
                                    IconButton(
                                        onClick = { viewModel.deleteProject(project.id) },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(Icons.Outlined.Delete, contentDescription = "Delete", tint = Rose400, modifier = Modifier.size(16.dp))
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Financial progress
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text("Total Fee", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                    Text(formatMoney(project.totalFee, sym), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                                }
                                Column {
                                    Text("Collected / Deposit", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                    Text(formatMoney(project.depositReceived, sym), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold, color = Emerald600)
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    Text("Remaining Due", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                    Text(
                                        text = formatMoney(project.balanceRemaining, sym),
                                        style = MaterialTheme.typography.titleSmall,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = if (project.balanceRemaining > 0) (if (project.status == ProjectStatus.OVERDUE) Rose600 else Amber600) else Emerald700
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            val progress = if (project.totalFee > 0) (project.depositReceived / project.totalFee).toFloat() else 0f
                            AnimatedProgressBar(
                                progress = progress,
                                barColor = if (progress >= 1f) Emerald500 else Amber500
                            )

                            if (project.notes.isNotBlank()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "📝 ${project.notes}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Action buttons: Clean horizontal proportion
                            if (!project.isFullyCollected) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Button(
                                        onClick = {
                                            collectProject = project
                                            collectAmountInput = project.balanceRemaining.toString()
                                        },
                                        modifier = Modifier
                                            .weight(1.2f)
                                            .height(44.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                        shape = RoundedCornerShape(12.dp),
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
                                    ) {
                                        Icon(Icons.Default.AttachMoney, contentDescription = null, modifier = Modifier.size(18.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = if (profile.language == "ro") "Încasează" else "Collect",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            maxLines = 1,
                                            overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                                        )
                                    }

                                    OutlinedButton(
                                        onClick = { reminderProject = project },
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(44.dp),
                                        shape = RoundedCornerShape(12.dp),
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Amber700),
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
                                    ) {
                                        Icon(Icons.Default.Message, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = if (profile.language == "ro") "Mesaj Client" else "Follow Up",
                                            fontWeight = FontWeight.SemiBold,
                                            fontSize = 13.sp,
                                            maxLines = 1,
                                            overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                                        )
                                    }
                                }
                            } else {
                                Surface(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(44.dp),
                                    shape = RoundedCornerShape(12.dp),
                                    color = Emerald50
                                ) {
                                    Row(
                                        modifier = Modifier.fillMaxSize(),
                                        horizontalArrangement = Arrangement.Center,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(Icons.Default.Check, contentDescription = null, tint = Emerald700, modifier = Modifier.size(18.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = if (profile.language == "ro") "Achitat Integral ✅" else "Paid & Settled ✅",
                                            color = Emerald800,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // --- ADD / EDIT GIG DIALOG ---
    if (showAddDialog || editingProject != null) {
        val isEditing = editingProject != null
        val existing = editingProject

        var clientName by remember { mutableStateOf(existing?.clientName ?: "") }
        var projectTitle by remember { mutableStateOf(existing?.projectTitle ?: "") }
        var category by remember { mutableStateOf(existing?.category ?: ProjectCategory.COMMERCIAL) }
        var totalFee by remember { mutableStateOf(existing?.totalFee?.toString() ?: "") }
        var depositReceived by remember { mutableStateOf(existing?.depositReceived?.toString() ?: "0") }
        var dueDate by remember { mutableStateOf(existing?.dueDate ?: "In 2 Weeks") }
        var invoiceNumber by remember { mutableStateOf(existing?.invoiceNumber ?: "INV-2026-00${(10..99).random()}") }
        var clientPhone by remember { mutableStateOf(existing?.clientPhone ?: "") }
        var clientEmail by remember { mutableStateOf(existing?.clientEmail ?: "") }
        var notes by remember { mutableStateOf(existing?.notes ?: "") }

        AlertDialog(
            onDismissRequest = {
                showAddDialog = false
                editingProject = null
            },
            title = {
                Text(if (isEditing) "Edit Videography Gig" else "New Freelance Shoot / Gig", fontWeight = FontWeight.Bold)
            },
            text = {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        OutlinedTextField(
                            value = clientName,
                            onValueChange = { clientName = it },
                            label = { Text("Client / Company Name *") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = projectTitle,
                            onValueChange = { projectTitle = it },
                            label = { Text("Project Title (e.g. Commercial 4K Reel) *") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = totalFee,
                                onValueChange = { totalFee = it },
                                label = { Text("Total Fee ($sym) *") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = depositReceived,
                                onValueChange = { depositReceived = it },
                                label = { Text("Deposit Paid ($sym)") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                    item {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = dueDate,
                                onValueChange = { dueDate = it },
                                label = { Text("Due Date") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = invoiceNumber,
                                onValueChange = { invoiceNumber = it },
                                label = { Text("Invoice #") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                    item {
                        OutlinedTextField(
                            value = clientPhone,
                            onValueChange = { clientPhone = it },
                            label = { Text("Client Phone (for WhatsApp follow up)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = notes,
                            onValueChange = { notes = it },
                            label = { Text("Notes / Deliverables (e.g. 4K cuts, color grading)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val fee = totalFee.toDoubleOrNull() ?: 0.0
                        val dep = depositReceived.toDoubleOrNull() ?: 0.0
                        if (clientName.isNotBlank() && projectTitle.isNotBlank() && fee > 0) {
                            if (isEditing && existing != null) {
                                viewModel.updateProject(
                                    existing.copy(
                                        clientName = clientName,
                                        projectTitle = projectTitle,
                                        category = category,
                                        totalFee = fee,
                                        depositReceived = dep,
                                        dueDate = dueDate,
                                        invoiceNumber = invoiceNumber,
                                        clientPhone = clientPhone,
                                        clientEmail = clientEmail,
                                        notes = notes
                                    )
                                )
                            } else {
                                viewModel.addProject(
                                    clientName = clientName,
                                    projectTitle = projectTitle,
                                    category = category,
                                    totalFee = fee,
                                    depositReceived = dep,
                                    dueDate = dueDate,
                                    invoiceNumber = invoiceNumber,
                                    clientPhone = clientPhone,
                                    clientEmail = clientEmail,
                                    notes = notes
                                )
                            }
                        }
                        showAddDialog = false
                        editingProject = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Text(if (isEditing) "Save Changes" else "Create Gig")
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    showAddDialog = false
                    editingProject = null
                }) {
                    Text("Cancel")
                }
            }
        )
    }

    // --- PAYMENT REMINDER MODAL (WHATSAPP & SMS SCRIPT GENERATOR) ---
    if (reminderProject != null) {
        val proj = reminderProject!!
        val politeMsg = "Hi ${proj.clientName}! Hope you're doing well. Just checking in regarding invoice ${proj.invoiceNumber} for ${formatMoney(proj.balanceRemaining, sym)} for the ${proj.projectTitle}. Could you let me know if this is queued for payment this week? Thank you!"
        val firmMsg = "Hello ${proj.clientName}, following up on invoice ${proj.invoiceNumber} (${formatMoney(proj.balanceRemaining, sym)}) which is now due. Please confirm when the wire transfer has been dispatched so we can mark your account as settled. Best regards!"

        var selectedMsg by remember { mutableStateOf(politeMsg) }

        AlertDialog(
            onDismissRequest = { reminderProject = null },
            title = {
                Text("📩 Payment Follow-Up for ${proj.clientName}", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Select a ready-to-send payment collection reminder:", style = MaterialTheme.typography.bodySmall)

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = selectedMsg == politeMsg,
                            onClick = { selectedMsg = politeMsg },
                            label = { Text("Polite Check-in") }
                        )
                        FilterChip(
                            selected = selectedMsg == firmMsg,
                            onClick = { selectedMsg = firmMsg },
                            label = { Text("Firm / Overdue") }
                        )
                    }

                    Card(
                        colors = CardDefaults.cardColors(containerColor = Slate100),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = selectedMsg,
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        val clip = ClipData.newPlainText("Invoice Reminder", selectedMsg)
                        clipboard.setPrimaryClip(clip)
                        Toast.makeText(context, "Message copied to clipboard!", Toast.LENGTH_SHORT).show()

                        // Try sharing via Intent
                        try {
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_TEXT, selectedMsg)
                            }
                            context.startActivity(Intent.createChooser(shareIntent, "Send Reminder via..."))
                        } catch (e: Exception) {
                            // Ignored if chooser fails
                        }
                        reminderProject = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Amber600)
                ) {
                    Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Copy & Send")
                }
            },
            dismissButton = {
                TextButton(onClick = { reminderProject = null }) {
                    Text("Close")
                }
            }
        )
    }

    // --- COLLECT PAYMENT MODAL ---
    if (collectProject != null) {
        val proj = collectProject!!
        AlertDialog(
            onDismissRequest = { collectProject = null },
            title = {
                Text("Collect Money: ${proj.clientName}", fontWeight = FontWeight.Bold)
            },
            text = {
                Column {
                    Text("Total Project Fee: ${formatMoney(proj.totalFee, sym)}")
                    Text("Remaining Balance Due: ${formatMoney(proj.balanceRemaining, sym)}", fontWeight = FontWeight.Bold, color = Emerald700)

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
                            text = "Auto-split 35% to highest Bank Debt and 35% to House Savings Vault",
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
                            Toast.makeText(context, "Collected ${formatMoney(amt, sym)}! Applied to Vaults.", Toast.LENGTH_SHORT).show()
                        }
                        collectProject = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Text("Confirm Collection")
                }
            },
            dismissButton = {
                TextButton(onClick = { collectProject = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}
