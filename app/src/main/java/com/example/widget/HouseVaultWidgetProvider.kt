package com.example.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.example.MainActivity
import com.example.R

class HouseVaultWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val views = RemoteViews(context.packageName, R.layout.house_vault_widget)
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            // ─── Read live data written by HouseVaultRepository.saveTargets() ───
            val prefs = context.getSharedPreferences("house_vault_data", Context.MODE_PRIVATE)

            // Seat Ateca live savings data
            val carTitle    = prefs.getString("widget_car_title", "🚙 Seat Ateca (15.000 €)") ?: "🚙 Seat Ateca (15.000 €)"
            val carPct      = prefs.getInt("widget_car_percent", 30).coerceIn(0, 100)
            val carSaved    = prefs.getLong("widget_car_saved", 22_500L)
            val carTarget   = prefs.getLong("widget_car_target", 75_000L)
            val carDeadline = prefs.getString("widget_car_deadline", "Dec 2027") ?: "Dec 2027"
            val isSyncActive = prefs.getString("vault_sync_code", null) != null

            // Format amounts with thousands separator
            val savedStr  = "%,d".format(carSaved)
            val targetStr = "%,d".format(carTarget)

            // Push live values into widget views
            views.setTextViewText(R.id.widget_car_title, carTitle)
            views.setProgressBar(R.id.widget_car_progress, 100, carPct, false)
            views.setTextViewText(
                R.id.widget_car_percent,
                "$carPct% • $savedStr / $targetStr lei • $carDeadline"
            )
            views.setTextViewText(
                R.id.widget_sync_badge,
                if (isSyncActive) "● Live Sync" else "● Local"
            )

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
