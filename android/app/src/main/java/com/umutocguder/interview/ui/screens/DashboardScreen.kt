package com.umutocguder.interview.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.umutocguder.interview.data.model.DifficultyLevel
import com.umutocguder.interview.data.model.Language
import com.umutocguder.interview.data.repository.QuestionRepository

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen() {
    var selectedLanguage by remember { mutableStateOf(Language.TR) }
    var selectedCategorySlug by remember { mutableStateOf("all") }
    var searchQuery by remember { mutableStateOf("") }
    var difficultyFilter by remember { mutableStateOf("all") }
    var onlyBookmarks by remember { mutableStateOf(false) }
    var bookmarkedIds by remember { mutableStateOf(setOf<String>()) }
    var revealedAnswerIds by remember { mutableStateOf(setOf<String>()) }
    var showSimulator by remember { mutableStateOf(false) }

    val allQuestions = QuestionRepository.questions
    val categories = QuestionRepository.categories

    // Filter questions
    val filteredQuestions = remember(
        selectedCategorySlug,
        searchQuery,
        difficultyFilter,
        onlyBookmarks,
        bookmarkedIds,
        selectedLanguage
    ) {
        allQuestions.filter { q ->
            // Category
            if (selectedCategorySlug == "android" && !q.tags.contains("Android")) return@filter false
            if (selectedCategorySlug == "swift-all" && !q.tags.contains("Swift")) return@filter false

            // Difficulty
            if (difficultyFilter != "all" && q.difficulty.name.lowercase() != difficultyFilter) return@filter false

            // Bookmark
            if (onlyBookmarks && !bookmarkedIds.contains(q.id)) return@filter false

            // Search
            val trimmed = searchQuery.trim().lowercase()
            if (trimmed.isNotEmpty()) {
                val c = q.getContent(selectedLanguage)
                val inTitle = c.title.lowercase().contains(trimmed) || q.tr.title.lowercase().contains(trimmed) || q.en.title.lowercase().contains(trimmed)
                val inText = c.questionText.lowercase().contains(trimmed)
                val inTags = q.tags.any { it.lowercase().contains(trimmed) }
                val inKeys = c.keyPoints.any { it.lowercase().contains(trimmed) }
                if (!inTitle && !inText && !inTags && !inKeys) return@filter false
            }

            true
        }
    }

    if (showSimulator) {
        InterviewSimulatorScreen(
            questions = filteredQuestions.ifEmpty { allQuestions },
            language = selectedLanguage,
            onClose = { showSimulator = false }
        )
        return
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "11 Interview",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                },
                actions = {
                    // Language Switcher Toggle
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        modifier = Modifier.padding(end = 12.dp)
                    ) {
                        Row(modifier = Modifier.padding(2.dp)) {
                            Button(
                                onClick = { selectedLanguage = Language.TR },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (selectedLanguage == Language.TR) MaterialTheme.colorScheme.primary else Color.Transparent,
                                    contentColor = if (selectedLanguage == Language.TR) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                                ),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.height(30.dp)
                            ) {
                                Text("🇹🇷 TR", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }

                            Button(
                                onClick = { selectedLanguage = Language.EN },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (selectedLanguage == Language.EN) MaterialTheme.colorScheme.primary else Color.Transparent,
                                    contentColor = if (selectedLanguage == Language.EN) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                                ),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.height(30.dp)
                            ) {
                                Text("🇬🇧 EN", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Hero Banner
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            brush = Brush.linearGradient(
                                colors = listOf(Color(0xFF1976D2), Color(0xFF512DA8), Color(0xFF6A1B9A))
                            ),
                            shape = RoundedCornerShape(16.dp)
                        )
                        .padding(20.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = if (selectedLanguage == Language.EN) "✨ Umut's Master Notes" else "✨ Umut'un Özel Notları",
                                color = Color.White.copy(alpha = 0.9f),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier
                                    .background(Color.White.opacity(0.2f), RoundedCornerShape(12.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                        Text(
                            text = if (selectedLanguage == Language.EN)
                                "Complete Senior Interview Prep"
                            else
                                "Kıdemli Mülakatlara Eksiksiz Hazırlık",
                            color = Color.White,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (selectedLanguage == Language.EN)
                                "Jetpack Compose, Swift 6 Concurrency, Actors & Architecture patterns in one native app."
                            else
                                "Jetpack Compose, Swift 6 Concurrency, Actor'lar ve Mimari pratiklerini native olarak çalışın.",
                            color = Color.White.copy(alpha = 0.9f),
                            fontSize = 13.sp
                        )
                        Button(
                            onClick = { showSimulator = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.padding(top = 4.dp)
                        ) {
                            Icon(Icons.Default.PlayArrow, contentDescription = null, tint = Color(0xFF1976D2))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                if (selectedLanguage == Language.EN) "Start Simulation (${filteredQuestions.size})" else "Simülasyonu Başlat (${filteredQuestions.size})",
                                color = Color(0xFF1976D2),
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }

            // Search Bar & Filter Row
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                        placeholder = {
                            Text(
                                if (selectedLanguage == Language.EN)
                                    "Search questions (e.g. actor, compose, flow)..."
                                else
                                    "Sorularda ara (örn: actor, compose, coroutine)...",
                                fontSize = 13.sp
                            )
                        },
                        trailingIcon = {
                            if (searchQuery.isNotEmpty()) {
                                IconButton(onClick = { searchQuery = "" }) {
                                    Icon(Icons.Default.Clear, contentDescription = "Clear")
                                }
                            }
                        }
                    )

                    // Starred & Difficulty chips
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        FilterChip(
                            selected = onlyBookmarks,
                            onClick = { onlyBookmarks = !onlyBookmarks },
                            label = {
                                Text(
                                    if (selectedLanguage == Language.EN) "Starred" else "Yıldızlılar",
                                    fontSize = 12.sp
                                )
                            },
                            leadingIcon = {
                                Icon(
                                    if (onlyBookmarks) Icons.Default.Star else Icons.Default.FavoriteBorder,
                                    contentDescription = null,
                                    tint = if (onlyBookmarks) Color(0xFFFFA000) else Color.Gray,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            listOf("all", "junior", "mid", "senior").forEach { diff ->
                                FilterChip(
                                    selected = difficultyFilter == diff,
                                    onClick = { difficultyFilter = diff },
                                    label = {
                                        Text(
                                            if (diff == "all") (if (selectedLanguage == Language.EN) "All" else "Tümü") else diff.replaceFirstChar { it.uppercase() },
                                            fontSize = 11.sp
                                        )
                                    }
                                )
                            }
                        }
                    }
                }
            }

            // Categories (Horizontal Scrolling Row)
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    categories.forEach { cat ->
                        val catContent = cat.getContent(selectedLanguage)
                        val isSelected = selectedCategorySlug == cat.slug
                        ElevatedFilterChip(
                            selected = isSelected,
                            onClick = { selectedCategorySlug = cat.slug },
                            label = { Text(catContent.name, fontSize = 12.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) }
                        )
                    }
                }
            }

            // Questions Section Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (selectedLanguage == Language.EN) "Interview Questions" else "Mülakat Soruları",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${filteredQuestions.size} ${if (selectedLanguage == Language.EN) "questions" else "soru"}",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }
            }

            // Question Items List
            items(filteredQuestions) { question ->
                val content = question.getContent(selectedLanguage)
                val isBookmarked = bookmarkedIds.contains(question.id)
                val isRevealed = revealedAnswerIds.contains(question.id)

                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = Color(0xFFFFF3E0)
                                ) {
                                    Text(
                                        text = question.difficulty.localizedTitle(selectedLanguage),
                                        color = Color(0xFFE65100),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                                question.tags.take(2).forEach { tag ->
                                    Text("#$tag", fontSize = 11.sp, color = Color.Gray)
                                }
                            }

                            IconButton(
                                onClick = {
                                    bookmarkedIds = if (isBookmarked) {
                                        bookmarkedIds - question.id
                                    } else {
                                        bookmarkedIds + question.id
                                    }
                                },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(
                                    if (isBookmarked) Icons.Default.Star else Icons.Default.FavoriteBorder,
                                    contentDescription = "Star",
                                    tint = if (isBookmarked) Color(0xFFFFA000) else Color.Gray,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = content.title,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = content.questionText,
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        if (isRevealed) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFFE3F2FD), RoundedCornerShape(10.dp))
                                    .padding(12.dp)
                            ) {
                                Text(
                                    text = if (selectedLanguage == Language.EN) "🎯 Ideal Architectural Answer" else "🎯 İdeal Mimari Yanıt",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = Color(0xFF1565C0)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = content.idealAnswer,
                                    fontSize = 12.sp,
                                    color = Color(0xFF0D47A1)
                                )

                                if (content.keyPoints.isNotEmpty()) {
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = if (selectedLanguage == Language.EN) "📌 Key Points:" else "📌 Kritik Noktalar:",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 11.sp,
                                        color = Color.DarkGray
                                    )
                                    content.keyPoints.forEach { pt ->
                                        Text("• $pt", fontSize = 11.sp, color = Color.Black)
                                    }
                                }
                            }
                        }

                        TextButton(
                            onClick = {
                                revealedAnswerIds = if (isRevealed) {
                                    revealedAnswerIds - question.id
                                } else {
                                    revealedAnswerIds + question.id
                                }
                            },
                            contentPadding = PaddingValues(0.dp)
                        ) {
                            Text(
                                text = if (isRevealed)
                                    (if (selectedLanguage == Language.EN) "Hide Answer" else "Cevabı Gizle")
                                else
                                    (if (selectedLanguage == Language.EN) "Explore Ideal Answer" else "İdeal Cevabı İncele"),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}

// Helper to provide Color.opacity
private fun Color.Companion.opacity(alpha: Float): Color = Color.White.copy(alpha = alpha)
