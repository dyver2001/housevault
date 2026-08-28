package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import com.example.data.AppStrings
import com.example.data.HouseholdProfile
import com.example.data.WindfallSplitRule
import com.example.ui.components.SectionHeader
import com.example.ui.theme.*
import com.example.ui.viewmodel.HouseVaultViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MobileShareScreen(viewModel: HouseVaultViewModel) {
    val context = LocalContext.current
    val profile by viewModel.profile.collectAsState()
    val splitRule by viewModel.splitRule.collectAsState()
    val exportJsonText by viewModel.exportJsonText.collectAsState()
    val vaultSyncCode by viewModel.vaultSyncCode.collectAsState()
    val isSyncing by viewModel.isSyncing.collectAsState()
    val syncStatusMsg by viewModel.syncStatusMessage.collectAsState()
    val lang = profile.language

    var showExportDialog by remember { mutableStateOf(false) }
    var showImportDialog by remember { mutableStateOf(false) }
    var importInputText by remember { mutableStateOf("") }
    var showProfileDialog by remember { mutableStateOf(false) }
    var showSplitRuleDialog by remember { mutableStateOf(false) }
    var showJoinDialog by remember { mutableStateOf(false) }
    var joinInputText by remember { mutableStateOf("") }

    val themes = listOf(
        Triple("emerald", "Emerald Forest", Emerald500),
        Triple("amber", "Amber Gold", Amber500),
        Triple("cyan", "Sapphire Cyan", Cyan400),
        Triple("rose", "Ruby Rose", Rose500),
        Triple("purple", "Amethyst Royal", Purple500),
        Triple("sunset", "Sunset Orange", Orange500),
        Triple("obsidian", "Obsidian AMOLED", Color(0xFF14161F))
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 90.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text(
                text = AppStrings.get("set_title", lang),
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.ExtraBold
            )
            Text(
                text = AppStrings.get("set_subtitle", lang),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // --- REAL-TIME COUPLE CLOUD SYNC CARD ---
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(shape = RoundedCornerShape(10.dp), color = Emerald100) {
                                Icon(Icons.Default.CloudSync, contentDescription = null, tint = Emerald700, modifier = Modifier.padding(8.dp).size(22.dp))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = if (lang == "ro") "Sincronizare Live în Cuplu" else "Couple Cloud Sync",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = if (lang == "ro")
                                        "${profile.husbandName.split(" ").firstOrNull() ?: "Haytham"} & ${profile.wifeName.split(" ").firstOrNull() ?: "Cati"} conectați în timp real"
                                    else
                                        "Sync ${profile.husbandName.split(" ").firstOrNull() ?: "Haytham"} & ${profile.wifeName.split(" ").firstOrNull() ?: "Cati"} in real time",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = Slate500
                                )
                            }
                        }

                        if (vaultSyncCode != null) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Emerald100
                            ) {
                                Text(
                                    text = "🟢 " + (if (lang == "ro") "Conectat" else "Connected"),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Emerald800,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                    }

                    Text(
                        text = if (lang == "ro")
                            "Când ${profile.husbandName.split(" ").firstOrNull() ?: "Haytham"} încasează un proiect video sau ${profile.wifeName.split(" ").firstOrNull() ?: "Cati"} bifează o cheltuială, ambele telefoane se actualizează automat fără fișiere manuale."
                            else "When ${profile.husbandName.split(" ").firstOrNull() ?: "Haytham"} collects gig money or ${profile.wifeName.split(" ").firstOrNull() ?: "Cati"} logs a bill, both phones update automatically in real time.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    if (vaultSyncCode != null) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(if (lang == "ro") "Cod Seif Activ:" else "Active Vault Code:", style = MaterialTheme.typography.labelSmall, color = Slate500)
                                        Text(vaultSyncCode ?: "", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.ExtraBold, color = Emerald600)
                                    }

                                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                        OutlinedButton(
                                            onClick = {
                                                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                                clipboard.setPrimaryClip(ClipData.newPlainText("HouseVault Code", vaultSyncCode))
                                                Toast.makeText(context, if (lang == "ro") "Cod copiat!" else "Code copied!", Toast.LENGTH_SHORT).show()
                                            },
                                            shape = RoundedCornerShape(8.dp),
                                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
                                        ) {
                                            Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(if (lang == "ro") "Copiază" else "Copy", fontSize = 12.sp)
                                        }

                                        Button(
                                            onClick = { viewModel.syncNow() },
                                            enabled = !isSyncing,
                                            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                            shape = RoundedCornerShape(8.dp),
                                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
                                        ) {
                                            Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(if (lang == "ro") "Sincronizează" else "Sync", fontSize = 12.sp)
                                        }
                                    }
                                }

                                TextButton(
                                    onClick = { viewModel.disconnectSync() },
                                    colors = ButtonDefaults.textButtonColors(contentColor = Rose600)
                                ) {
                                    Text(if (lang == "ro") "Deconectează Seiful" else "Disconnect Vault", fontSize = 11.sp)
                                }
                            }
                        }
                    } else {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { viewModel.generateVaultCode() },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(containerColor = Amber600),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Icon(Icons.Default.AddLink, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(if (lang == "ro") "Generează Cod" else "Create Code", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }

                            OutlinedButton(
                                onClick = { showJoinDialog = true },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Icon(Icons.Default.Link, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(if (lang == "ro") "Introdu Cod" else "Join Code", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    if (syncStatusMsg != null) {
                        Text(
                            text = syncStatusMsg ?: "",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }

        // --- LANGUAGE & CURRENCY FREEDOM ---
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(shape = RoundedCornerShape(10.dp), color = Amber100) {
                            Icon(Icons.Default.Language, contentDescription = null, tint = Amber700, modifier = Modifier.padding(8.dp).size(22.dp))
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(AppStrings.get("set_language", lang), fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            Text("Alege limba aplicației / Select language", style = MaterialTheme.typography.bodySmall, color = Slate500)
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = profile.language == "ro",
                            onClick = { viewModel.updateProfile(profile.copy(language = "ro")) },
                            label = { Text("🇷🇴 Română (RON)", fontWeight = FontWeight.Bold, fontSize = 12.sp) }
                        )
                        FilterChip(
                            selected = profile.language == "en",
                            onClick = { viewModel.updateProfile(profile.copy(language = "en")) },
                            label = { Text("🇬🇧 English (Global)", fontWeight = FontWeight.Bold, fontSize = 12.sp) }
                        )
                    }

                    Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))

                    Text(if (lang == "ro") "Monedă Curentă:" else "Active Currency:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                    val quickCurrencies = listOf(
                        Triple("lei", "RON", "RON (lei) 🇷🇴"),
                        Triple("€", "EUR", "EUR (€) 🇪🇺"),
                        Triple("$", "USD", "USD ($) 🇺🇸"),
                        Triple("£", "GBP", "GBP (£) 🇬🇧")
                    )
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(quickCurrencies) { (sym, code, label) ->
                            FilterChip(
                                selected = profile.currencyCode == code,
                                onClick = { viewModel.updateProfile(profile.copy(currencySymbol = sym, currencyCode = code)) },
                                label = { Text(label, fontSize = 11.sp, fontWeight = if (profile.currencyCode == code) FontWeight.Bold else FontWeight.Normal) }
                            )
                        }
                    }
                }
            }
        }

        // --- COLOR THEMES & FREEDOM ---
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(shape = RoundedCornerShape(10.dp), color = Emerald50) {
                            Icon(Icons.Default.Palette, contentDescription = null, tint = Emerald700, modifier = Modifier.padding(8.dp).size(22.dp))
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(AppStrings.get("set_theme_color", lang), fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            Text(if (lang == "ro") "Schimbă paleta de culori și nuanțele vizuale" else "Customize color palettes and visual tones", style = MaterialTheme.typography.bodySmall, color = Slate500)
                        }
                    }

                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(themes) { (presetKey, presetName, previewColor) ->
                            val isSelected = profile.themePreset.lowercase() == presetKey
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (isSelected) previewColor.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant,
                                border = if (isSelected) androidx.compose.foundation.BorderStroke(2.dp, previewColor) else null,
                                modifier = Modifier.clickable {
                                    viewModel.updateProfile(profile.copy(themePreset = presetKey))
                                }
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Box(modifier = Modifier.size(14.dp).clip(CircleShape).background(previewColor))
                                    Text(presetName, fontSize = 11.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal)
                                }
                            }
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = profile.themeMode == "dark",
                            onClick = { viewModel.updateProfile(profile.copy(themeMode = "dark")) },
                            label = { Text("🌙 Dark Mode", fontSize = 11.sp) }
                        )
                        FilterChip(
                            selected = profile.themeMode == "light",
                            onClick = { viewModel.updateProfile(profile.copy(themeMode = "light")) },
                            label = { Text("☀️ Light Mode", fontSize = 11.sp) }
                        )
                        FilterChip(
                            selected = profile.themeMode == "system",
                            onClick = { viewModel.updateProfile(profile.copy(themeMode = "system")) },
                            label = { Text("⚙️ System", fontSize = 11.sp) }
                        )
                    }
                }
            }
        }

        // --- COUPLE PROFILE & WINDFALL RULES ---
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(if (lang == "ro") "Date Cuplu & Salarii" else "Couple Income Configuration", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                    
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(profile.wifeName, style = MaterialTheme.typography.bodySmall, color = Slate500)
                        Text("${profile.wifeMonthlySalary.toInt()} ${profile.currencySymbol}/lună", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodySmall)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(profile.husbandName, style = MaterialTheme.typography.bodySmall, color = Slate500)
                        Text("~${profile.husbandEstMonthlyGross.toInt()} ${profile.currencySymbol}/lună", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodySmall)
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    Button(
                        onClick = { showProfileDialog = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(if (lang == "ro") "Editează Profilul & Salariile" else "Edit Couple Profile & Salaries")
                    }
                }
            }
        }

        // --- DATA SYNC & BACKUP ---
        item {
            SectionHeader(
                title = if (lang == "ro") "Sincronizare & Backup Date" else "Data Portability & Backup",
                subtitle = if (lang == "ro") "Exportă și importă datele ușor între telefonul tău și al soției" else "Share JSON backups between devices without account setup"
            )
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedButton(
                        onClick = {
                            viewModel.exportData()
                            showExportDialog = true
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(AppStrings.get("set_export", lang))
                    }

                    OutlinedButton(
                        onClick = { showImportDialog = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Upload, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(AppStrings.get("set_import", lang))
                    }

                    TextButton(
                        onClick = {
                            viewModel.resetToDefaults()
                            Toast.makeText(context, if (lang == "ro") "Date resetate la valorile implicite!" else "Reset to default sample numbers!", Toast.LENGTH_SHORT).show()
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(AppStrings.get("set_reset", lang), color = Rose600, fontSize = 12.sp)
                    }
                }
            }
        }
    }

    // --- EXPORT DIALOG ---
    if (showExportDialog && exportJsonText != null) {
        AlertDialog(
            onDismissRequest = { showExportDialog = false },
            title = { Text(if (lang == "ro") "Export Date HouseVault" else "Household Data Backup", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text(if (lang == "ro") "Copiază textul JSON de mai jos:" else "Copy this JSON string or send it to your spouse:", style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(8.dp))
                    Surface(
                        modifier = Modifier.fillMaxWidth().height(140.dp),
                        shape = RoundedCornerShape(8.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant
                    ) {
                        Text(
                            text = exportJsonText ?: "",
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(8.dp),
                            maxLines = 8
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        val clip = ClipData.newPlainText("HouseVault Backup", exportJsonText ?: "")
                        clipboard.setPrimaryClip(clip)
                        Toast.makeText(context, if (lang == "ro") "Copiat în clipboard!" else "Backup copied to clipboard!", Toast.LENGTH_SHORT).show()
                        showExportDialog = false
                    }
                ) {
                    Text(if (lang == "ro") "Copiază" else "Copy & Share")
                }
            },
            dismissButton = {
                TextButton(onClick = { showExportDialog = false }) {
                    Text(if (lang == "ro") "Închide" else "Close")
                }
            }
        )
    }

    // --- IMPORT DIALOG ---
    if (showImportDialog) {
        AlertDialog(
            onDismissRequest = { showImportDialog = false },
            title = { Text(if (lang == "ro") "Importă Date" else "Import Household Data", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text(if (lang == "ro") "Lipește codul JSON de backup mai jos:" else "Paste the JSON backup string below:", style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = importInputText,
                        onValueChange = { importInputText = it },
                        label = { Text("JSON Data") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 4
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (importInputText.isNotBlank()) {
                            val success = viewModel.importData(importInputText)
                            if (success) {
                                Toast.makeText(context, if (lang == "ro") "Date importate cu succes!" else "Data imported successfully!", Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText(context, if (lang == "ro") "Format JSON invalid" else "Invalid JSON format", Toast.LENGTH_SHORT).show()
                            }
                        }
                        showImportDialog = false
                    }
                ) {
                    Text(if (lang == "ro") "Importă" else "Import")
                }
            },
            dismissButton = {
                TextButton(onClick = { showImportDialog = false }) {
                    Text(if (lang == "ro") "Anulează" else "Cancel")
                }
            }
        )
    }

    // --- EDIT PROFILE DIALOG ---
    if (showProfileDialog) {
        var hName by remember { mutableStateOf(profile.husbandName) }
        var wName by remember { mutableStateOf(profile.wifeName) }
        var wSalary by remember { mutableStateOf(profile.wifeMonthlySalary.toString()) }
        var hEstGross by remember { mutableStateOf(profile.husbandEstMonthlyGross.toString()) }
        var curSymbol by remember { mutableStateOf(profile.currencySymbol) }
        var curCode by remember { mutableStateOf(profile.currencyCode) }

        val currencyOptions = listOf(
            Triple("lei", "RON", "RON (lei) 🇷🇴"),
            Triple("€", "EUR", "EUR (€) 🇪🇺"),
            Triple("$", "USD", "USD ($) 🇺🇸"),
            Triple("£", "GBP", "GBP (£) 🇬🇧")
        )

        AlertDialog(
            onDismissRequest = { showProfileDialog = false },
            title = { Text(if (lang == "ro") "Profil Cuplu & Monedă" else "Household Profile & Currency", fontWeight = FontWeight.Bold) },
            text = {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    item {
                        Text(if (lang == "ro") "Monedă:" else "Select Currency:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(currencyOptions) { (sym, code, label) ->
                                FilterChip(
                                    selected = curCode == code,
                                    onClick = {
                                        curSymbol = sym
                                        curCode = code
                                    },
                                    label = { Text(label, fontSize = 11.sp) }
                                )
                            }
                        }
                    }

                    item {
                        OutlinedTextField(
                            value = hName,
                            onValueChange = { hName = it },
                            label = { Text(if (lang == "ro") "Nume & Rol Soț (ex: Alex)" else "Husband Name & Title") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    item {
                        OutlinedTextField(
                            value = wName,
                            onValueChange = { wName = it },
                            label = { Text(if (lang == "ro") "Nume & Rol Soție (ex: Elena)" else "Wife Name & Title") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    item {
                        OutlinedTextField(
                            value = wSalary,
                            onValueChange = { wSalary = it },
                            label = { Text(if (lang == "ro") "Salariu Fix Lunar Soție ($curSymbol)" else "Wife Monthly Salary ($curSymbol)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    item {
                        OutlinedTextField(
                            value = hEstGross,
                            onValueChange = { hEstGross = it },
                            label = { Text(if (lang == "ro") "Încasări Estimate Freelance Soț ($curSymbol)" else "Husband Freelance Gross ($curSymbol)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val sal = wSalary.toDoubleOrNull() ?: profile.wifeMonthlySalary
                        val gro = hEstGross.toDoubleOrNull() ?: profile.husbandEstMonthlyGross
                        viewModel.updateProfile(
                            profile.copy(
                                husbandName = hName,
                                wifeName = wName,
                                wifeMonthlySalary = sal,
                                husbandEstMonthlyGross = gro,
                                currencySymbol = curSymbol,
                                currencyCode = curCode
                            )
                        )
                        showProfileDialog = false
                    }
                ) {
                    Text(AppStrings.get("set_save", lang))
                }
            },
            dismissButton = {
                TextButton(onClick = { showProfileDialog = false }) {
                    Text(if (lang == "ro") "Anulează" else "Cancel")
                }
            }
        )
    }

    // --- JOIN CLOUD ROOM DIALOG ---
    if (showJoinDialog) {
        AlertDialog(
            onDismissRequest = { showJoinDialog = false },
            title = {
                Text(if (lang == "ro") "🔗 Conectare la Seif Partener" else "🔗 Join Partner's Vault", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        if (lang == "ro") "Introduceți codul de 6 caractere primit de la soț/soție (ex: HV-8821):"
                        else "Enter the sync code from your spouse (e.g. HV-8821):",
                        style = MaterialTheme.typography.bodySmall
                    )
                    OutlinedTextField(
                        value = joinInputText,
                        onValueChange = { joinInputText = it.uppercase() },
                        placeholder = { Text("ex: HV-8821") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (joinInputText.isNotBlank()) {
                            viewModel.joinVaultCode(joinInputText.trim())
                            showJoinDialog = false
                            joinInputText = ""
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Text(if (lang == "ro") "Conectează" else "Join")
                }
            },
            dismissButton = {
                TextButton(onClick = { showJoinDialog = false }) {
                    Text(if (lang == "ro") "Anulează" else "Cancel")
                }
            }
        )
    }
}
