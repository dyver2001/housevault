package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*
import com.example.ui.viewmodel.HouseVaultViewModel

@Composable
fun AuthScreen(
    viewModel: HouseVaultViewModel,
    onContinueOffline: () -> Unit
) {
    var mode by remember { mutableStateOf("login") } // "login" or "register"
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("Haytham (Videograf)") }
    var role by remember { mutableStateOf("husband") }
    var vaultCode by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    fun quickPreset(preset: String) {
        if (preset == "haytham") {
            email = "haytham@housevault.app"
            name = "Haytham (Videograf)"
            role = "husband"
        } else {
            email = "cati@housevault.app"
            name = "Cati (IT Support)"
            role = "wife"
        }
        password = "housevault2026"
        errorMessage = null
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(20.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight(),
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // App Logo & Header
                Surface(
                    shape = RoundedCornerShape(18.dp),
                    color = Emerald100,
                    modifier = Modifier.size(54.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = null,
                            tint = Emerald700,
                            modifier = Modifier.size(30.dp)
                        )
                    }
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "HouseVault Accounts",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Black
                    )
                    Text(
                        text = "Haytham & Cati Shared Cloud Vault",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // 1-Tap Quick Partner Sign In Card
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "⚡ AUTENTIFICARE RAPIDĂ PARTENER:",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Amber100,
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { quickPreset("haytham") }
                            ) {
                                Column(modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp)) {
                                    Text("Haytham", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Amber700)
                                    Text("Videograf", fontSize = 10.sp, color = Slate500)
                                }
                            }

                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Emerald100,
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { quickPreset("cati") }
                            ) {
                                Column(modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp)) {
                                    Text("Cati", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Emerald700)
                                    Text("IT Support", fontSize = 10.sp, color = Slate500)
                                }
                            }
                        }
                    }
                }

                // Mode Tabs (Login vs Register)
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(modifier = Modifier.padding(4.dp)) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (mode == "login") Emerald600 else Color.Transparent,
                            modifier = Modifier
                                .weight(1f)
                                .clickable { mode = "login"; errorMessage = null }
                        ) {
                            Text(
                                text = "Autentificare",
                                modifier = Modifier.padding(vertical = 8.dp),
                                color = if (mode == "login") Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (mode == "register") Emerald600 else Color.Transparent,
                            modifier = Modifier
                                .weight(1f)
                                .clickable { mode = "register"; errorMessage = null }
                        ) {
                            Text(
                                text = "Creare Cont",
                                modifier = Modifier.padding(vertical = 8.dp),
                                color = if (mode == "register") Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )
                        }
                    }
                }

                // Error Banner
                if (errorMessage != null) {
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Rose100,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = Rose700, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(errorMessage!!, color = Rose700, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }

                // Fields
                if (mode == "register") {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Nume / Rol") },
                        leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Parolă") },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                    trailingIcon = {
                        IconButton(onClick = { showPassword = !showPassword }) {
                            Icon(
                                if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = null
                            )
                        }
                    },
                    visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    shape = RoundedCornerShape(12.dp)
                )

                if (mode == "register") {
                    OutlinedTextField(
                        value = vaultCode,
                        onValueChange = { vaultCode = it.uppercase() },
                        label = { Text("Cod Seif Cuplu (ex: HV-8821)") },
                        leadingIcon = { Icon(Icons.Default.Key, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                Button(
                    onClick = {
                        if (email.isBlank() || password.isBlank()) {
                            errorMessage = "Introduceți emailul și parola."
                            return@Button
                        }
                        isLoading = true
                        errorMessage = null

                        if (mode == "login") {
                            viewModel.login(email.trim(), password) { success, err ->
                                isLoading = false
                                if (!success) errorMessage = err ?: "Autentificare eșuată"
                            }
                        } else {
                            viewModel.register(email.trim(), password, name.trim(), role, vaultCode.trim().ifBlank { null }) { success, err ->
                                isLoading = false
                                if (!success) errorMessage = err ?: "Înregistrare eșuată"
                            }
                        }
                    },
                    enabled = !isLoading,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White, strokeWidth = 2.dp)
                    } else {
                        Text(
                            text = if (mode == "login") "Intră în Cont" else "Creează Contul",
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Continue Offline / Guest
                TextButton(onClick = onContinueOffline) {
                    Text("Continuă în mod Local / Oaspete ➔", color = Slate500, fontSize = 12.sp)
                }
            }
        }
    }
}
