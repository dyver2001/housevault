package com.example.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

data class AuthResult(
    val success: Boolean,
    val token: String? = null,
    val user: AuthUser? = null,
    val vaultData: JSONObject? = null,
    val errorMessage: String? = null
)

object AuthService {

    suspend fun register(
        serverUrl: String,
        email: String,
        password: String,
        name: String,
        role: String = "husband",
        vaultCode: String? = null,
        deviceJson: JSONObject? = null
    ): AuthResult = withContext(Dispatchers.IO) {
        try {
            val cleanUrl = serverUrl.trimEnd('/')
            val endpoint = "$cleanUrl/api/auth/register"
            val url = URL(endpoint)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8")
            conn.connectTimeout = 8000
            conn.readTimeout = 8000
            conn.doOutput = true
            conn.doInput = true

            val body = JSONObject().apply {
                put("email", email.trim())
                put("password", password)
                put("name", name.trim())
                put("role", role)
                if (!vaultCode.isNullOrBlank()) put("vaultCode", vaultCode.trim().uppercase())
                if (deviceJson != null) put("device", deviceJson)
            }

            OutputStreamWriter(conn.outputStream, "UTF-8").use { writer ->
                writer.write(body.toString())
                writer.flush()
            }

            val responseCode = conn.responseCode
            val isSuccess = responseCode in 200..299
            val stream = if (isSuccess) conn.inputStream else conn.errorStream
            val responseText = BufferedReader(InputStreamReader(stream, "UTF-8")).use { it.readText() }
            val json = JSONObject(responseText)

            if (isSuccess && json.optBoolean("success")) {
                val token = json.optString("token")
                val userObj = json.optJSONObject("user")
                val user = if (userObj != null) {
                    AuthUser(
                        id = userObj.optString("id"),
                        email = userObj.optString("email"),
                        name = userObj.optString("name"),
                        role = userObj.optString("role", "husband"),
                        vaultCode = userObj.optString("vaultCode").ifBlank { null }
                    )
                } else null
                val vaultData = json.optJSONObject("vault")?.optJSONObject("data")
                AuthResult(success = true, token = token, user = user, vaultData = vaultData)
            } else {
                AuthResult(success = false, errorMessage = json.optString("error", "Eroare la înregistrare"))
            }
        } catch (e: Exception) {
            AuthResult(success = false, errorMessage = e.message ?: "Conexiunea la server a eșuat")
        }
    }

    suspend fun login(
        serverUrl: String,
        email: String,
        password: String,
        deviceJson: JSONObject? = null
    ): AuthResult = withContext(Dispatchers.IO) {
        try {
            val cleanUrl = serverUrl.trimEnd('/')
            val endpoint = "$cleanUrl/api/auth/login"
            val url = URL(endpoint)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8")
            conn.connectTimeout = 8000
            conn.readTimeout = 8000
            conn.doOutput = true
            conn.doInput = true

            val body = JSONObject().apply {
                put("email", email.trim())
                put("password", password)
                if (deviceJson != null) put("device", deviceJson)
            }

            OutputStreamWriter(conn.outputStream, "UTF-8").use { writer ->
                writer.write(body.toString())
                writer.flush()
            }

            val responseCode = conn.responseCode
            val isSuccess = responseCode in 200..299
            val stream = if (isSuccess) conn.inputStream else conn.errorStream
            val responseText = BufferedReader(InputStreamReader(stream, "UTF-8")).use { it.readText() }
            val json = JSONObject(responseText)

            if (isSuccess && json.optBoolean("success")) {
                val token = json.optString("token")
                val userObj = json.optJSONObject("user")
                val user = if (userObj != null) {
                    AuthUser(
                        id = userObj.optString("id"),
                        email = userObj.optString("email"),
                        name = userObj.optString("name"),
                        role = userObj.optString("role", "husband"),
                        vaultCode = userObj.optString("vaultCode").ifBlank { null }
                    )
                } else null
                val vaultData = json.optJSONObject("vault")?.optJSONObject("data")
                AuthResult(success = true, token = token, user = user, vaultData = vaultData)
            } else {
                AuthResult(success = false, errorMessage = json.optString("error", "Email sau parolă incorectă"))
            }
        } catch (e: Exception) {
            AuthResult(success = false, errorMessage = e.message ?: "Conexiunea la server a eșuat")
        }
    }

    suspend fun getMe(serverUrl: String, token: String): AuthResult = withContext(Dispatchers.IO) {
        try {
            val cleanUrl = serverUrl.trimEnd('/')
            val endpoint = "$cleanUrl/api/auth/me"
            val url = URL(endpoint)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            conn.setRequestProperty("Authorization", "Bearer $token")
            conn.connectTimeout = 8000
            conn.readTimeout = 8000

            val responseCode = conn.responseCode
            if (responseCode in 200..299) {
                val responseText = BufferedReader(InputStreamReader(conn.inputStream, "UTF-8")).use { it.readText() }
                val json = JSONObject(responseText)
                val userObj = json.optJSONObject("user")
                val user = if (userObj != null) {
                    AuthUser(
                        id = userObj.optString("id"),
                        email = userObj.optString("email"),
                        name = userObj.optString("name"),
                        role = userObj.optString("role", "husband"),
                        vaultCode = userObj.optString("vaultCode").ifBlank { null }
                    )
                } else null
                val vaultData = json.optJSONObject("vault")?.optJSONObject("data")
                AuthResult(success = true, token = token, user = user, vaultData = vaultData)
            } else {
                AuthResult(success = false, errorMessage = "Sesiune invalidă")
            }
        } catch (e: Exception) {
            AuthResult(success = false, errorMessage = e.message)
        }
    }
}
