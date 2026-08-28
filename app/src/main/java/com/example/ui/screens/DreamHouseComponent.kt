package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DirectionsCar
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
    val carTarget = targets.find {
        it.title.contains("seat", ignoreCase = true) || it.title.contains("ateca", ignoreCase = true) || it.title.contains("masin", ignoreCase = true) || it.title.contains("mașin", ignoreCase = true) || it.title.contains("car", ignoreCase = true)
    } ?: targets.firstOrNull() ?: SavingsTarget(
        id = "target-seat-ateca",
        title = "Seat Ateca (15.000 €)",
        targetAmount = 75000.0,
        currentSavedAmount = 22500.0,
        priority = com.example.data.TargetPriority.CRITICAL,
        category = "VEHICLE",
        deadline = "2027-12-31",
        iconName = "car"
    )

    val percent = ((carTarget.currentSavedAmount / (if (carTarget.targetAmount > 0) carTarget.targetAmount else 1.0)) * 100).toInt().coerceIn(0, 100)

    val stage = when {
        percent < 25 -> 1
        percent < 50 -> 2
        percent < 75 -> 3
        else -> 4
    }

    val stageName = when (stage) {
        1 -> "Șasiu SUV & Jante Aliaj 18\" 🛞"
        2 -> "Caroserie Seat Ateca & Bare Plafon 🚙"
        3 -> "Motor 2.0 TDI & Faruri Full-LED ⚡"
        else -> "Seat Ateca Gata de Drum • Cheia în Mână! 🔑"
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
                            Icon(Icons.Default.DirectionsCar, contentDescription = null, tint = EmeraldPrimary, modifier = Modifier.size(22.dp))
                        }
                    }
                    Column {
                        Text("Seat Ateca (SUV Familie)", fontWeight = FontWeight.Black, color = Color.White, fontSize = 15.sp)
                        Text(
                            "${carTarget.currentSavedAmount.toInt()} / ${carTarget.targetAmount.toInt()} ${profile.currencySymbol} (~15.000 €)",
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
                    Triple("1. Șasiu", 25, "🛞"),
                    Triple("2. Caroserie", 50, "🚙"),
                    Triple("3. Motor", 75, "⚡"),
                    Triple("4. La Drum!", 100, "🔑")
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
