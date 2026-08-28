package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.BankDebt
import com.example.data.FreelanceProject
import com.example.data.HouseholdExpense
import com.example.data.HouseholdProfile
import com.example.ui.theme.*
import java.util.*

@Composable
fun CashFlowCalendarScreen(
    profile: HouseholdProfile,
    projects: List<FreelanceProject>,
    debts: List<BankDebt>,
    expenses: List<HouseholdExpense>
) {
    val calendar = remember { Calendar.getInstance() }
    var monthOffset by remember { mutableIntStateOf(0) }

    val currentMonthCalendar = remember(monthOffset) {
        Calendar.getInstance().apply {
            add(Calendar.MONTH, monthOffset)
            set(Calendar.DAY_OF_MONTH, 1)
        }
    }

    val daysInMonth = currentMonthCalendar.getActualMaximum(Calendar.DAY_OF_MONTH)
    val firstDayOfWeek = (currentMonthCalendar.get(Calendar.DAY_OF_WEEK) + 5) % 7 // Monday = 0

    val monthName = remember(monthOffset) {
        currentMonthCalendar.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale("ro", "RO")) ?: "Luna"
    }
    val year = currentMonthCalendar.get(Calendar.YEAR)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = CardBackground)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .background(CyanAccent.copy(alpha = 0.15f), RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.CalendarMonth, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(20.dp))
                    }
                    Column {
                        Text("Calendar Plăți & Încasări", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 15.sp)
                        Text("$monthName $year", fontSize = 11.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold)
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    IconButton(
                        onClick = { monthOffset-- },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.ChevronLeft, contentDescription = "Prev", tint = Color.White)
                    }
                    IconButton(
                        onClick = { monthOffset++ },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.ChevronRight, contentDescription = "Next", tint = Color.White)
                    }
                }
            }
        }

        // Days of week header
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceAround) {
            listOf("L", "M", "M", "J", "V", "S", "D").forEach { d ->
                Text(d, color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Calendar Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(7),
            verticalArrangement = Arrangement.spacedBy(6.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            // Empty slots before 1st of month
            items(firstDayOfWeek) {
                Box(modifier = Modifier.height(64.dp))
            }

            // Days
            items(daysInMonth) { index ->
                val day = index + 1
                val isToday = day == 28 && monthOffset == 0

                val hasSalary = day == 15
                val hasBill = expenses.isNotEmpty() && (day == 5 || day == 10 || day == 20)
                val hasDebt = debts.any { it.dueDayOfMonth == day }
                val hasIncome = projects.any { it.status == com.example.data.ProjectStatus.INVOICED } && day == 22

                Card(
                    modifier = Modifier.height(64.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isToday) EmeraldPrimary.copy(alpha = 0.2f) else CardBackground
                    ),
                    border = CardDefaults.outlinedCardBorder().copy(
                        brush = androidx.compose.ui.graphics.SolidColor(
                            if (isToday) EmeraldPrimary else Color(0xFF2A2E2C)
                        )
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(4.dp),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            day.toString(),
                            fontSize = 10.sp,
                            fontWeight = if (isToday) FontWeight.Black else FontWeight.Bold,
                            color = if (isToday) EmeraldPrimary else Color.White
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.End,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            if (hasSalary || hasIncome) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .background(EmeraldPrimary, androidx.compose.foundation.shape.CircleShape)
                                )
                                Spacer(modifier = Modifier.width(2.dp))
                            }
                            if (hasBill) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .background(Color(0xFFF43F5E), androidx.compose.foundation.shape.CircleShape)
                                )
                                Spacer(modifier = Modifier.width(2.dp))
                            }
                            if (hasDebt) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .background(Color(0xFFA855F7), androidx.compose.foundation.shape.CircleShape)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
