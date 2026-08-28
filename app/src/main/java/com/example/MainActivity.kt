package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.screens.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.AppTab
import com.example.ui.viewmodel.HouseVaultViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: HouseVaultViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val profile by viewModel.profile.collectAsState()
            MyApplicationTheme(preset = profile.themePreset, themeMode = profile.themeMode) {
                MainAppScreen(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScreen(viewModel: HouseVaultViewModel) {
    val currentTab by viewModel.currentTab.collectAsState()
    val profile by viewModel.profile.collectAsState()
    val projects by viewModel.projects.collectAsState()
    val debts by viewModel.debts.collectAsState()
    val expenses by viewModel.expenses.collectAsState()
    val targets by viewModel.targets.collectAsState()
    val currentUser by viewModel.currentUser.collectAsState()
    var dismissedAuth by remember { mutableStateOf(false) }

    if (currentUser == null && !dismissedAuth) {
        AuthScreen(
            viewModel = viewModel,
            onContinueOffline = { dismissedAuth = true }
        )
        return
    }

    val pendingCount = projects.count { !it.isFullyCollected }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // User Avatar Bubble (Revolut Style)
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(CircleShape)
                                .background(Emerald800)
                                .clickable { viewModel.selectTab(AppTab.SHARE_APK) },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = (currentUser?.name?.firstOrNull() ?: 'H').toString().uppercase(),
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 14.sp
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(
                                text = "HouseVault",
                                fontWeight = FontWeight.Black,
                                fontSize = 18.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Emerald100
                            ) {
                                Text(
                                    text = profile.currencyCode,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Emerald800,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp),
                                    fontSize = 10.sp
                                )
                            }
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { viewModel.selectTab(AppTab.ACTIVITY) }) {
                        Icon(
                            Icons.Default.Notifications,
                            contentDescription = "Feed Cuplu",
                            tint = if (currentTab == AppTab.ACTIVITY) Amber500 else Slate500,
                            modifier = Modifier.size(22.dp)
                        )
                    }

                    IconButton(onClick = { viewModel.selectTab(AppTab.SHARE_APK) }) {
                        Icon(
                            Icons.Default.Settings,
                            contentDescription = "Settings",
                            tint = if (currentTab == AppTab.SHARE_APK) Emerald600 else Slate500,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                val lang = profile.language
                val navItems = listOf(
                    Triple(AppTab.DASHBOARD, com.example.data.AppStrings.get("nav_vault", lang), Icons.Default.AccountBalanceWallet),
                    Triple(AppTab.COLLECTOR, com.example.data.AppStrings.get("nav_collect", lang), Icons.Default.AttachMoney),
                    Triple(AppTab.HOUSE_BUDGET, com.example.data.AppStrings.get("nav_budget", lang), Icons.Default.Home),
                    Triple(AppTab.BANK_DEBT, com.example.data.AppStrings.get("nav_debts", lang), Icons.Default.CreditCard),
                    Triple(AppTab.TARGETS, com.example.data.AppStrings.get("nav_targets", lang), Icons.Default.Savings),
                    Triple(AppTab.SHARE_APK, com.example.data.AppStrings.get("nav_settings", lang), Icons.Default.Settings)
                )

                val primaryColor = MaterialTheme.colorScheme.primary
                val onPrimaryContainer = MaterialTheme.colorScheme.primaryContainer

                navItems.forEach { (tab, label, icon) ->
                    val isSelected = currentTab == tab
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { viewModel.selectTab(tab) },
                        icon = {
                            BadgedBox(
                                badge = {
                                    if (tab == AppTab.COLLECTOR && pendingCount > 0) {
                                        Badge(
                                            containerColor = Amber500,
                                            contentColor = Slate900,
                                            modifier = Modifier.offset(x = 4.dp, y = (-2).dp)
                                        ) {
                                            Text("$pendingCount", fontWeight = FontWeight.Bold, fontSize = 10.sp)
                                        }
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = label,
                                    tint = if (isSelected) primaryColor else Slate400,
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                        },
                        label = {
                            Text(
                                text = label,
                                fontSize = 10.sp,
                                fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.Medium,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = primaryColor,
                            selectedTextColor = primaryColor,
                            indicatorColor = onPrimaryContainer.copy(alpha = 0.5f),
                            unselectedTextColor = Slate400,
                            unselectedIconColor = Slate400
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentTab) {
                AppTab.DASHBOARD -> DashboardScreen(viewModel = viewModel, onNavigate = { viewModel.selectTab(it) })
                AppTab.COLLECTOR -> FreelanceCollectorScreen(viewModel = viewModel)
                AppTab.HOUSE_BUDGET -> HouseholdBudgetScreen(viewModel = viewModel)
                AppTab.BANK_DEBT -> BankDebtScreen(viewModel = viewModel)
                AppTab.TARGETS -> SavingsTargetsScreen(viewModel = viewModel)
                AppTab.CALENDAR -> CashFlowCalendarScreen(profile = profile, projects = projects, debts = debts, expenses = expenses)
                AppTab.GEAR_TAX -> GearTaxScreen(profile = profile)
                AppTab.ACTIVITY -> ActivityFeedScreen(profile = profile)
                AppTab.AI_ADVISOR -> AiAdvisorScreen(viewModel = viewModel)
                AppTab.SHARE_APK -> MobileShareScreen(viewModel = viewModel)
            }
        }
    }
}
