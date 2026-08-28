package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

fun getAppColorScheme(preset: String, isDark: Boolean): ColorScheme {
    return when (preset.lowercase()) {
        "amber", "gold" -> if (isDark) {
            darkColorScheme(
                primary = Amber400, onPrimary = Slate950, primaryContainer = Amber700, onPrimaryContainer = Amber100,
                secondary = Emerald400, onSecondary = Slate950,
                background = Slate900, surface = Slate800, onSurface = Slate100, outline = Slate600
            )
        } else {
            lightColorScheme(
                primary = Amber600, onPrimary = Color.White, primaryContainer = Amber50, onPrimaryContainer = Amber700,
                secondary = Emerald600, onSecondary = Color.White,
                background = Slate50, surface = SurfaceLight, onSurface = Slate900, outline = Slate200
            )
        }
        "cyan", "sapphire" -> if (isDark) {
            darkColorScheme(
                primary = Cyan400, onPrimary = Slate950, primaryContainer = Cyan700, onPrimaryContainer = Cyan100,
                secondary = Amber400, onSecondary = Slate950,
                background = Slate900, surface = Slate800, onSurface = Slate100, outline = Slate600
            )
        } else {
            lightColorScheme(
                primary = Cyan600, onPrimary = Color.White, primaryContainer = Cyan100, onPrimaryContainer = Cyan700,
                secondary = Amber600, onSecondary = Color.White,
                background = Slate50, surface = SurfaceLight, onSurface = Slate900, outline = Slate200
            )
        }
        "rose", "ruby" -> if (isDark) {
            darkColorScheme(
                primary = Rose400, onPrimary = Slate950, primaryContainer = Rose700, onPrimaryContainer = Rose100,
                secondary = Amber400, onSecondary = Slate950,
                background = Slate900, surface = Slate800, onSurface = Slate100, outline = Slate600
            )
        } else {
            lightColorScheme(
                primary = Rose600, onPrimary = Color.White, primaryContainer = Rose50, onPrimaryContainer = Rose700,
                secondary = Amber600, onSecondary = Color.White,
                background = Slate50, surface = SurfaceLight, onSurface = Slate900, outline = Slate200
            )
        }
        "purple", "amethyst" -> if (isDark) {
            darkColorScheme(
                primary = Purple400, onPrimary = Slate950, primaryContainer = Purple700, onPrimaryContainer = Purple100,
                secondary = Cyan400, onSecondary = Slate950,
                background = Slate900, surface = Slate800, onSurface = Slate100, outline = Slate600
            )
        } else {
            lightColorScheme(
                primary = Purple600, onPrimary = Color.White, primaryContainer = Purple100, onPrimaryContainer = Purple700,
                secondary = Cyan600, onSecondary = Color.White,
                background = Slate50, surface = SurfaceLight, onSurface = Slate900, outline = Slate200
            )
        }
        "orange", "sunset" -> if (isDark) {
            darkColorScheme(
                primary = Orange400, onPrimary = Slate950, primaryContainer = Orange700, onPrimaryContainer = Orange100,
                secondary = Amber400, onSecondary = Slate950,
                background = Slate900, surface = Slate800, onSurface = Slate100, outline = Slate600
            )
        } else {
            lightColorScheme(
                primary = Orange600, onPrimary = Color.White, primaryContainer = Orange100, onPrimaryContainer = Orange700,
                secondary = Amber600, onSecondary = Color.White,
                background = Slate50, surface = SurfaceLight, onSurface = Slate900, outline = Slate200
            )
        }
        "obsidian" -> {
            darkColorScheme(
                primary = Amber400, onPrimary = Color.Black, primaryContainer = Slate800, onPrimaryContainer = Amber100,
                secondary = Emerald400, onSecondary = Color.Black,
                background = ObsidianDark, surface = Color(0xFF14161F), onSurface = Color(0xFFF1F5F9), outline = Color(0xFF2E3440)
            )
        }
        else -> { // Default Emerald
            if (isDark) {
                darkColorScheme(
                    primary = Emerald400, onPrimary = Slate900, primaryContainer = Emerald900, onPrimaryContainer = Emerald100,
                    secondary = Amber400, onSecondary = Slate900, secondaryContainer = Amber700, onSecondaryContainer = Amber100,
                    tertiary = Rose400, onTertiary = Slate900,
                    background = BackgroundDark, onBackground = Slate100, surface = SurfaceDark, onSurface = Slate100,
                    surfaceVariant = Slate800, onSurfaceVariant = Slate300, outline = Slate600
                )
            } else {
                lightColorScheme(
                    primary = Emerald600, onPrimary = Color.White, primaryContainer = Emerald50, onPrimaryContainer = Emerald900,
                    secondary = Amber600, onSecondary = Color.White, secondaryContainer = Amber50, onSecondaryContainer = Amber700,
                    tertiary = Rose600, onTertiary = Color.White,
                    background = BackgroundLight, onBackground = Slate900, surface = SurfaceLight, onSurface = Slate800,
                    surfaceVariant = Slate100, onSurfaceVariant = Slate600, outline = Slate200
                )
            }
        }
    }
}

@Composable
fun MyApplicationTheme(
    preset: String = "emerald",
    themeMode: String = "system",
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit,
) {
    val systemDark = isSystemInDarkTheme()
    val isDark = when (themeMode) {
        "dark" -> true
        "light" -> false
        else -> systemDark
    }

    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (isDark) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        else -> getAppColorScheme(preset, isDark)
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
