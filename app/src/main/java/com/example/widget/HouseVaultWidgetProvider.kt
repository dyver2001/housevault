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

            // Read preferences if available
            val prefs = context.getSharedPreferences("housevault_prefs", Context.MODE_PRIVATE)
            val isSyncActive = prefs.getString("vault_sync_code", null) != null

            views.setTextViewText(
                R.id.widget_sync_badge,
                if (isSyncActive) "● Live Sync" else "● Local"
            )

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
