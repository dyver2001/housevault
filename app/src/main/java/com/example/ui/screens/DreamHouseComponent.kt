package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Key
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.HouseholdProfile
import com.example.data.SavingsTarget
import com.example.ui.theme.*

@Composable
fun DreamHouseComponent(
    targets: List<SavingsTarget>,
    profile: HouseholdProfile,
    onDepositClick: () -> Unit = {}
) {
    val houseTarget = targets.find {
        it.title.contains("cas", ignoreCase = true) || it.title.contains("house", ignoreCase = true) || it.title.contains("avans", ignoreCase = true)
    } ?: targets.firstOrNull() ?: SavingsTarget(
        id = "default-house",
        title = "Avans Casă de Vis (3 Camere)",
        targetAmount = 150000.0,
        currentSavedAmount = 38500.0,
        priority = com.example.data.TargetPriority.CRITICAL,
        category = "HOUSING",
        deadline = "2027-12-31",
        iconName = "home"
    )

    val percent = ((houseTarget.currentSavedAmount / (if (houseTarget.targetAmount > 0) houseTarget.targetAmount else 1.0)) * 100).toInt().coerceIn(0, 100)

    val stage = when {
        percent < 25 -> 1
        percent < 50 -> 2
        percent < 75 -> 3
        else -> 4
    }

    val stageName = when (stage) {
        1 -> "Fundație & Terasament 🏗️"
        2 -> "Zidărie Cărămidă & Geamuri 🧱"
        3 -> "Acoperiș & Panouri Solare 🏠"
        else -> "Casa Finalizată • Cheia în Mână! 🔑"
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF141A17)),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = Brush.horizontalGradient(listOf(AmberGold.copy(alpha = 0.5f), EmeraldPrimary.copy(alpha = 0.5f)))
        )
    ) {
        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .background(Brush.linearGradient(listOf(AmberGold, EmeraldPrimary)), RoundedCornerShape(12.dp))
                            .padding(1.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(CardBackground, RoundedCornerShape(11.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Home, contentDescription = null, tint = AmberGold, modifier = Modifier.size(22.dp))
                        }
                    }
                    Column {
                        Text("Casa Noastră de Vis", fontWeight = FontWeight.Black, color = Color.White, fontSize = 15.sp)
                        Text(
                            "${houseTarget.currentSavedAmount.toInt()} / ${houseTarget.targetAmount.toInt()} ${profile.currencySymbol}",
                            fontSize = 11.sp,
                            color = TextSecondary
                        )
                    }
                }

                Surface(
                    color = EmeraldPrimary.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(8.dp),
                    border = CardDefaults.outlinedCardBorder().copy(brush = Brush.horizontalGradient(listOf(EmeraldPrimary, EmeraldPrimary)))
                ) {
                    Text(
                        "$percent% GATA",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldPrimary
                    )
                }
            }

            // Visual Progress Bar
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                LinearProgressIndicator(
                    progress = { percent / 100f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(10.dp)
                        .clip(CircleShape),
                    color = EmeraldPrimary,
                    trackColor = Color(0xFF2A2E2C)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Etapa $stage/4: $stageName", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = AmberGold)
                    Text("$percent%", fontSize = 11.sp, fontWeight = FontWeight.Black, color = EmeraldPrimary)
                }
            }

            // 4-Stage Milestone Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                listOf(
                    Triple("1. Fundație", 25, "🏗️"),
                    Triple("2. Ziduri", 50, "🧱"),
                    Triple("3. Acoperiș", 75, "🏠"),
                    Triple("4. Cheia", 100, "🔑")
                ).forEach { (label, threshold, icon) ->
                    val isCompleted = percent >= threshold
                    val isCurrent = !isCompleted && (if (threshold == 25) percent < 25 else percent >= (threshold - 25))

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(
                                when {
                                    isCompleted -> EmeraldPrimary.copy(alpha = 0.15f)
                                    isCurrent -> AmberGold.copy(alpha = 0.15f)
                                    else -> Color(0xFF1E2220)
                                },
                                RoundedCornerShape(10.dp)
                            )
                            .border(
                                1.dp,
                                when {
                                    isCompleted -> EmeraldPrimary.copy(alpha = 0.4f)
                                    isCurrent -> AmberGold.copy(alpha = 0.5f)
                                    else -> Color(0xFF2A2E2C)
                                },
                                RoundedCornerShape(10.dp)
                            )
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(icon, fontSize = 14.sp)
                            Text(
                                label,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isCompleted) EmeraldPrimary else if (isCurrent) AmberGold else TextSecondary
                            )
                        }
                    }
                }
            }
        }
    }
}
