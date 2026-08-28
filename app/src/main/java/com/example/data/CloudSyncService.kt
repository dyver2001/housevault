package com.example.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object CloudSyncService {

    suspend fun createVaultRoom(
        serverUrl: String,
        initialDataJson: JSONObject,
        partnerName: String
    ): Pair<Boolean, String?> = withContext(Dispatchers.IO) {
        try {
            val cleanUrl = serverUrl.trimEnd('/')
            val endpoint = "$cleanUrl/api/sync/create"
            val url = URL(endpoint)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8")
            conn.connectTimeout = 8000
            conn.readTimeout = 8000
            conn.doOutput = true
            conn.doInput = true

            val body = JSONObject().apply {
                put("initialData", initialDataJson)
                put("updatedBy", partnerName)
            }

            OutputStreamWriter(conn.outputStream, "UTF-8").use { writer ->
                writer.write(body.toString())
                writer.flush()
            }

            val responseCode = conn.responseCode
            if (responseCode in 200..299) {
                val responseText = BufferedReader(InputStreamReader(conn.inputStream, "UTF-8")).use { it.readText() }
                val json = JSONObject(responseText)
                val code = json.optString("vaultCode")
                Pair(true, code)
            } else {
                Pair(false, "Server response code: $responseCode")
            }
        } catch (e: Exception) {
            Pair(false, e.message ?: "Connection failed")
        }
    }

    suspend fun joinVaultRoom(
        serverUrl: String,
        vaultCode: String
    ): Pair<Boolean, JSONObject?> = withContext(Dispatchers.IO) {
        try {
            val cleanUrl = serverUrl.trimEnd('/')
            val endpoint = "$cleanUrl/api/sync/join"
            val url = URL(endpoint)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8")
            conn.connectTimeout = 8000
            conn.readTimeout = 8000
            conn.doOutput = true
            conn.doInput = true

            val body = JSONObject().apply {
                put("vaultCode", vaultCode.trim().uppercase())
            }

            OutputStreamWriter(conn.outputStream, "UTF-8").use { writer ->
                writer.write(body.toString())
                writer.flush()
            }

            val responseCode = conn.responseCode
            if (responseCode in 200..299) {
                val responseText = BufferedReader(InputStreamReader(conn.inputStream, "UTF-8")).use { it.readText() }
                val json = JSONObject(responseText)
                val vault = json.optJSONObject("vault")
                val data = vault?.optJSONObject("data")
                Pair(true, data)
            } else {
                Pair(false, null)
            }
        } catch (e: Exception) {
            Pair(false, null)
        }
    }

    suspend fun pushVaultUpdate(
        serverUrl: String,
        vaultCode: String,
        dataJson: JSONObject,
        partnerName: String
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val cleanUrl = serverUrl.trimEnd('/')
            val endpoint = "$cleanUrl/api/sync/${vaultCode.trim().uppercase()}/push"
            val url = URL(endpoint)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8")
            conn.connectTimeout = 8000
            conn.readTimeout = 8000
            conn.doOutput = true
            conn.doInput = true

            val body = JSONObject().apply {
                put("data", dataJson)
                put("updatedBy", partnerName)
            }

            OutputStreamWriter(conn.outputStream, "UTF-8").use { writer ->
                writer.write(body.toString())
                writer.flush()
            }

            val responseCode = conn.responseCode
            responseCode in 200..299
        } catch (e: Exception) {
            false
        }
    }

    suspend fun fetchVaultSnapshot(
        serverUrl: String,
        vaultCode: String
    ): Pair<Boolean, JSONObject?> = withContext(Dispatchers.IO) {
        try {
            val cleanUrl = serverUrl.trimEnd('/')
            val endpoint = "$cleanUrl/api/sync/${vaultCode.trim().uppercase()}"
            val url = URL(endpoint)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            conn.connectTimeout = 8000
            conn.readTimeout = 8000

            val responseCode = conn.responseCode
            if (responseCode in 200..299) {
                val responseText = BufferedReader(InputStreamReader(conn.inputStream, "UTF-8")).use { it.readText() }
                val json = JSONObject(responseText)
                val vault = json.optJSONObject("vault")
                val data = vault?.optJSONObject("data")
                Pair(true, data)
            } else {
                Pair(false, null)
            }
        } catch (e: Exception) {
            Pair(false, null)
        }
    }
}
