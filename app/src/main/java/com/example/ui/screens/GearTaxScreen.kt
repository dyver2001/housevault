package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Videocam
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

data class VideoGear(
    val id: String,
    val name: String,
    val cost: Double,
    val feePerShoot: Double,
    val shootsDone: Int
)

@Composable
fun GearTaxScreen(
    profile: HouseholdProfile
) {
    var selectedTab by remember { mutableIntStateOf(0) }

    var gearList by remember {
        mutableStateOf(
            listOf(
                VideoGear("1", "Sony FX3 Cinema Camera + Cage", 18500.0, 1200.0, 14),
                VideoGear("2", "DJI Mavic 3 Pro Cine Drone", 9500.0, 800.0, 12),
                VideoGear("3", "Sony GM 24-70mm f/2.8 II", 11000.0, 600.0, 18)
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Switcher
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(
                onClick = { selectedTab = 0 },
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (selectedTab == 0) AmberGold else Color(0xFF1E2220),
                    contentColor = if (selectedTab == 0) Color.Black else Color.White
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("🎥 Amortizare Gear", fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
            Button(
                onClick = { selectedTab = 1 },
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (selectedTab == 1) EmeraldPrimary else Color(0xFF1E2220),
                    contentColor = if (selectedTab == 1) Color.Black else Color.White
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("🏛️ Taxe PFA / SRL", fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
        }

        if (selectedTab == 0) {
            // Gear List
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(gearList) { gear ->
                    val totalEarned = gear.shootsDone * gear.feePerShoot
                    val isPaidOff = totalEarned >= gear.cost
                    val percent = ((totalEarned / gear.cost) * 100).toInt().coerceIn(0, 100)

                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isPaidOff) Color(0xFF13201A) else CardBackground
                        ),
                        border = CardDefaults.outlinedCardBorder().copy(
                            brush = androidx.compose.ui.graphics.SolidColor(
                                if (isPaidOff) EmeraldPrimary.copy(alpha = 0.5f) else Color(0xFF2A2E2C)
                            )
                        )
                    ) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(gear.name, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 13.sp)
                                    Text("Cost: ${gear.cost.toInt()} ${profile.currencySymbol} • Tarif: ${gear.feePerShoot.toInt()} ${profile.currencySymbol}/filmare", fontSize = 10.sp, color = TextSecondary)
                                }
                                Surface(
                                    color = if (isPaidOff) EmeraldPrimary.copy(alpha = 0.2f) else AmberGold.copy(alpha = 0.2f),
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(
                                        if (isPaidOff) "✅ AMORTIZAT" else "${gear.shootsDone} Filmări",
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isPaidOff) EmeraldPrimary else AmberGold
                                    )
                                }
                            }

                            LinearProgressIndicator(
                                progress = { percent / 100f },
                                modifier = Modifier.fillMaxWidth().height(6.dp),
                                color = if (isPaidOff) EmeraldPrimary else AmberGold,
                                trackColor = Color(0xFF2A2E2C)
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Încasat: ${totalEarned.toInt()} ${profile.currencySymbol} ($percent%)", fontSize = 11.sp, color = Color.White)
                                Button(
                                    onClick = {
                                        gearList = gearList.map {
                                            if (it.id == gear.id) it.copy(shootsDone = it.shootsDone + 1) else it
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF242A27)),
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text("+1 Filmare 🎬", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // Romanian Tax Calculator
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("🏛️ Calculator Rezervă Fiscală (România 2026)", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 14.sp)
                    Text("Regula de 15% Tax Reserve din fiecare încasare acoperă integral impozitul și contribuțiile CAS/CASS.", fontSize = 11.sp, color = TextSecondary, lineHeight = 15.sp)

                    Divider(color = Color(0xFF2A2E2C))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Venit Anual Estimat Video:", fontSize = 12.sp, color = TextSecondary)
                        Text("144.000 ${profile.currencySymbol}", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Structură Recomandată:", fontSize = 12.sp, color = TextSecondary)
                        Text("SRL Micro (1% + 8%)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = EmeraldPrimary)
                    }

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Rezervă Lunară Recomandată:", fontSize = 12.sp, color = TextSecondary)
                        Text("~1.800 ${profile.currencySymbol} / lună", fontSize = 13.sp, fontWeight = FontWeight.Black, color = AmberGold)
                    }
                }
            }
        }
    }
}
