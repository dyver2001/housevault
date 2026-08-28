package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.HouseholdProfile
import com.example.ui.theme.*

data class ActivityFeedEntry(
    val id: String,
    val timestamp: String,
    val actorName: String,
    val title: String,
    val type: String,
    val amount: Double = 0.0,
    val reactions: Map<String, Int> = emptyMap()
)

@Composable
fun ActivityFeedScreen(
    profile: HouseholdProfile,
    onReact: (String, String) -> Unit = { _, _ -> }
) {
    var filter by remember { mutableStateOf("ALL") }

    val sampleActivities = remember {
        listOf(
            ActivityFeedEntry("1", "Acum 15m", "Haytham", "A încasat 4.500 lei pentru Proiectul Commercial Video Shoot", "PROJECT", 4500.0, mapOf("🎉" to 3, "❤️" to 2)),
            ActivityFeedEntry("2", "Acum 2h", "Cati", "A bifat factura de Utilități & Curent (380 lei)", "BILL", 380.0, mapOf("✅" to 2, "❤️" to 1)),
            ActivityFeedEntry("3", "Acum 5h", "Haytham", "Depunere automată de 1.575 lei în Seiful Casei (35% Split)", "VAULT", 1575.0, mapOf("🏡" to 4, "🔥" to 2)),
            ActivityFeedEntry("4", "Ieri", "Cati", "Achitat 1.575 lei anticipat spre Cardul de Credit (DAE 24%)", "DEBT", 1575.0, mapOf("💪" to 3, "🎉" to 2))
        )
    }

    val filtered = sampleActivities.filter {
        when (filter) {
            "HAYTHAM" -> it.actorName.contains("haytham", ignoreCase = true)
            "CATI" -> it.actorName.contains("cati", ignoreCase = true)
            else -> true
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = CardBackground)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .background(AmberGold.copy(alpha = 0.15f), RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Notifications, contentDescription = null, tint = AmberGold, modifier = Modifier.size(20.dp))
                    }
                    Column {
                        Text("Activitate Live în Cuplu", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 16.sp)
                        Text("${profile.husbandName.split(" ")[0]} & ${profile.wifeName.split(" ")[0]} Shared Timeline", fontSize = 11.sp, color = TextSecondary)
                    }
                }

                // Filter tabs
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("ALL" to "Toate", "HAYTHAM" to "Haytham 🎬", "CATI" to "Cati 💻").forEach { (f, label) ->
                        Button(
                            onClick = { filter = f },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (filter == f) EmeraldPrimary else Color(0xFF1E2220),
                                contentColor = if (filter == f) Color.Black else Color.White
                            ),
                            shape = RoundedCornerShape(10.dp),
                            contentPadding = PaddingValues(vertical = 6.dp)
                        ) {
                            Text(label, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Timeline Feed
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(filtered) { item ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBackground),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Color(0xFF2A2E2C)))
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(if (item.actorName.contains("haytham", ignoreCase = true)) "🎬" else "💻", fontSize = 14.sp)
                                Text(item.actorName, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 13.sp)
                                Surface(
                                    color = when (item.type) {
                                        "PROJECT" -> AmberGold.copy(alpha = 0.15f)
                                        "BILL" -> CyanAccent.copy(alpha = 0.15f)
                                        "VAULT" -> EmeraldPrimary.copy(alpha = 0.15f)
                                        else -> Color(0xFF9333EA).copy(alpha = 0.15f)
                                    },
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(
                                        when (item.type) {
                                            "PROJECT" -> "Încasare"
                                            "BILL" -> "Factură"
                                            "VAULT" -> "Seif Casă"
                                            else -> "Datorie"
                                        },
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = when (item.type) {
                                            "PROJECT" -> AmberGold
                                            "BILL" -> CyanAccent
                                            "VAULT" -> EmeraldPrimary
                                            else -> Color(0xFFC084FC)
                                        }
                                    )
                                }
                            }
                            Text(item.timestamp, fontSize = 10.sp, color = TextSecondary)
                        }

                        Text(item.title, color = Color(0xFFE5E7EB), fontSize = 12.sp, lineHeight = 16.sp)

                        // Reactions Bar
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                item.reactions.forEach { (emoji, count) ->
                                    Surface(
                                        color = Color(0xFF1E2220),
                                        shape = CircleShape,
                                        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Color(0xFF333835)))
                                    ) {
                                        Text("$emoji $count", modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp), fontSize = 10.sp, color = Color.White)
                                    }
                                }
                            }

                            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                listOf("❤️", "🎉", "🚀", "💪", "🔥").forEach { emoji ->
                                    IconButton(
                                        onClick = { onReact(item.id, emoji) },
                                        modifier = Modifier.size(24.dp)
                                    ) {
                                        Text(emoji, fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
