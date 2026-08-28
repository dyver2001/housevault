package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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

data class CalendarDetailItem(
    val title: String,
    val amount: Double,
    val isIncome: Boolean,
    val category: String,
    val notes: String = ""
)

@Composable
fun CashFlowCalendarScreen(
    profile: HouseholdProfile,
    projects: List<FreelanceProject>,
    debts: List<BankDebt>,
    expenses: List<HouseholdExpense>
) {
    var monthOffset by remember { mutableIntStateOf(0) }
    val todayDay = remember { Calendar.getInstance().get(Calendar.DAY_OF_MONTH) }
    var selectedDay by remember { mutableIntStateOf(todayDay) }

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

    // Compute events on the selected day
    val selectedDayEvents = remember(selectedDay, monthOffset, expenses, debts, projects) {
        val list = mutableListOf<CalendarDetailItem>()

        // Salary on 15th
        if (selectedDay == 15) {
            list.add(
                CalendarDetailItem(
                    title = "Salariu ${profile.wifeName.split(" ").firstOrNull() ?: "Cati"} (IT Support)",
                    amount = profile.wifeMonthlySalary,
                    isIncome = true,
                    category = "Salariu Stabil",
                    notes = "Venit de bază pentru acoperirea ratelor și facturilor"
                )
            )
        }

        // Debts on due day
        debts.filter { (it.dueDayOfMonth ?: 20) == selectedDay }.forEach { debt ->
            list.add(
                CalendarDetailItem(
                    title = "Rată: ${debt.bankName}",
                    amount = debt.minMonthlyPayment,
                    isIncome = false,
                    category = "Rată Bancară",
                    notes = "Sold rămas: ${String.format(Locale.US, "%,.0f", debt.currentBalance)} ${profile.currencySymbol}"
                )
            )
        }

        // Fixed bills spread
        expenses.forEachIndexed { idx, exp ->
            val due = ((idx * 3 + 4) % 28) + 1
            if (due == selectedDay) {
                list.add(
                    CalendarDetailItem(
                        title = exp.title,
                        amount = exp.amount,
                        isIncome = false,
                        category = exp.category.name,
                        notes = "Cheltuială fixă lunară"
                    )
                )
            }
        }

        // Freelance project invoices due
        projects.filter { it.balanceRemaining > 0 }.forEach { proj ->
            if (selectedDay == 22) {
                list.add(
                    CalendarDetailItem(
                        title = "Încasare: ${proj.projectTitle}",
                        amount = if (proj.balanceRemaining > 0) proj.balanceRemaining else proj.totalFee,
                        isIncome = true,
                        category = "Video Freelance",
                        notes = "Client: ${proj.clientName}"
                    )
                )
            }
        }

        list
    }

    val totalPay = selectedDayEvents.filter { !it.isIncome }.sumOf { it.amount }
    val totalInflow = selectedDayEvents.filter { it.isIncome }.sumOf { it.amount }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
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
                        Text("Calendarul Plăților", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 16.sp)
                        Text("$monthName $year", fontSize = 12.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold)
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    IconButton(
                        onClick = {
                            monthOffset--
                            selectedDay = 1
                        },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.ChevronLeft, contentDescription = "Prev", tint = Color.White)
                    }
                    IconButton(
                        onClick = {
                            monthOffset++
                            selectedDay = 1
                        },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.ChevronRight, contentDescription = "Next", tint = Color.White)
                    }
                }
            }
        }

        // Calendar Section Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = CardBackground)
        ) {
            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                // Days of week header
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceAround) {
                    listOf("L", "M", "M", "J", "V", "S", "D").forEachIndexed { idx, d ->
                        Text(
                            d,
                            color = if (idx >= 5) Amber500 else TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Days Grid (custom fixed layout)
                val totalSlots = firstDayOfWeek + daysInMonth
                val totalRows = (totalSlots + 6) / 7

                for (row in 0 until totalRows) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        for (col in 0..6) {
                            val slotIndex = row * 7 + col
                            val dayNumber = slotIndex - firstDayOfWeek + 1

                            if (dayNumber in 1..daysInMonth) {
                                val isToday = dayNumber == todayDay && monthOffset == 0
                                val isSelected = dayNumber == selectedDay

                                val hasSalary = dayNumber == 15
                                val hasDebt = debts.any { (it.dueDayOfMonth ?: 20) == dayNumber }
                                val hasBill = expenses.isNotEmpty() && ((dayNumber % 5 == 0) || (dayNumber % 7 == 0))

                                Card(
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(48.dp)
                                        .clickable { selectedDay = dayNumber },
                                    shape = RoundedCornerShape(8.dp),
                                    colors = CardDefaults.cardColors(
                                        containerColor = if (isSelected) EmeraldPrimary.copy(alpha = 0.25f)
                                        else if (isToday) Color(0xFF1E2E24)
                                        else Color(0xFF141716)
                                    ),
                                    border = CardDefaults.outlinedCardBorder().copy(
                                        brush = androidx.compose.ui.graphics.SolidColor(
                                            if (isSelected) EmeraldPrimary
                                            else if (isToday) Amber500
                                            else Color(0xFF232826)
                                        )
                                    )
                                ) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxSize()
                                            .padding(3.dp),
                                        verticalArrangement = Arrangement.SpaceBetween,
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Text(
                                            dayNumber.toString(),
                                            fontSize = 11.sp,
                                            fontWeight = if (isSelected || isToday) FontWeight.Black else FontWeight.Bold,
                                            color = if (isSelected) EmeraldPrimary else if (isToday) Amber500 else Color.White
                                        )

                                        Row(
                                            horizontalArrangement = Arrangement.Center,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            if (hasSalary) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(4.dp)
                                                        .background(EmeraldPrimary, CircleShape)
                                                )
                                                Spacer(modifier = Modifier.width(2.dp))
                                            }
                                            if (hasBill) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(4.dp)
                                                        .background(Color(0xFFF43F5E), CircleShape)
                                                )
                                                Spacer(modifier = Modifier.width(2.dp))
                                            }
                                            if (hasDebt) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(4.dp)
                                                        .background(Color(0xFFA855F7), CircleShape)
                                                )
                                            }
                                        }
                                    }
                                }
                            } else {
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(48.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // Selected Date Breakdown Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = CardBackground)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Surface(shape = RoundedCornerShape(6.dp), color = EmeraldPrimary.copy(alpha = 0.15f)) {
                            Text(
                                "Scadențe $selectedDay $monthName $year",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = EmeraldPrimary
                            )
                        }
                    }

                    if (totalPay > 0 || totalInflow > 0) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            if (totalPay > 0) {
                                Text(
                                    "-${String.format(Locale.US, "%,.0f", totalPay)} ${profile.currencySymbol}",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 13.sp,
                                    color = Color(0xFFF43F5E)
                                )
                            }
                            if (totalInflow > 0) {
                                Text(
                                    "+${String.format(Locale.US, "%,.0f", totalInflow)} ${profile.currencySymbol}",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 13.sp,
                                    color = EmeraldPrimary
                                )
                            }
                        }
                    }
                }

                HorizontalDivider(color = Color(0xFF2A2E2C))

                if (selectedDayEvents.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldPrimary, modifier = Modifier.size(28.dp))
                            Text("Fără plăți programate pe această dată.", fontSize = 13.sp, color = TextSecondary)
                        }
                    }
                } else {
                    selectedDayEvents.forEach { event ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (event.isIncome) Color(0xFF0F241A) else Color(0xFF24141A)
                            ),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(
                                    if (event.isIncome) EmeraldPrimary.copy(alpha = 0.4f) else Color(0xFFF43F5E).copy(alpha = 0.4f)
                                )
                            )
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    modifier = Modifier.weight(1f),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(36.dp)
                                            .background(
                                                if (event.isIncome) EmeraldPrimary.copy(alpha = 0.2f) else Color(0xFFF43F5E).copy(alpha = 0.2f),
                                                RoundedCornerShape(8.dp)
                                            ),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = if (event.isIncome) Icons.Default.TrendingUp else Icons.Default.Receipt,
                                            contentDescription = null,
                                            tint = if (event.isIncome) EmeraldPrimary else Color(0xFFF43F5E),
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }

                                    Column {
                                        Text(event.title, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 13.sp)
                                        if (event.notes.isNotEmpty()) {
                                            Text(event.notes, fontSize = 11.sp, color = TextSecondary)
                                        }
                                    }
                                }

                                Text(
                                    text = "${if (event.isIncome) "+" else "-"}${String.format(Locale.US, "%,.0f", event.amount)} ${profile.currencySymbol}",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 14.sp,
                                    color = if (event.isIncome) EmeraldPrimary else Color(0xFFF43F5E)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
