package com.umutocguder.interview.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.umutocguder.interview.data.model.Language
import com.umutocguder.interview.data.model.Question
import kotlinx.coroutines.delay

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InterviewSimulatorScreen(
    questions: List<Question>,
    language: Language,
    onClose: () -> Unit
) {
    var currentIndex by remember { mutableStateOf(0) }
    var userAnswer by remember { mutableStateOf("") }
    var timeLeft by remember { mutableStateOf(180) }
    var isTimerActive by remember { mutableStateOf(true) }
    var isEvaluating by remember { mutableStateOf(false) }
    var evaluationScore by remember { mutableStateOf<Int?>(null) }
    var evaluationStrengths by remember { mutableStateOf<List<String>>(emptyList()) }
    var evaluationImprovements by remember { mutableStateOf<List<String>>(emptyList()) }
    var followUpQuestion by remember { mutableStateOf<String?>(null) }

    val currentQ = questions.getOrNull(currentIndex) ?: questions.first()
    val content = currentQ.getContent(language)

    // Timer effect
    LaunchedEffect(isTimerActive, timeLeft) {
        if (isTimerActive && timeLeft > 0) {
            delay(1000L)
            timeLeft -= 1
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        if (language == Language.EN) "Live Simulator" else "Canlı Simülatör",
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onClose) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                },
                actions = {
                    val minutes = timeLeft / 60
                    val seconds = timeLeft % 60
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (timeLeft < 30) Color(0xFFFFEBEE) else MaterialTheme.colorScheme.surfaceVariant,
                        modifier = Modifier.padding(end = 12.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.DateRange,
                                contentDescription = "Timer",
                                tint = if (timeLeft < 30) Color.Red else MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                String.format("%02d:%02d", minutes, seconds),
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = if (timeLeft < 30) Color.Red else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Soru Kartı
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = if (language == Language.EN) "Interviewer Question" else "Mülakatçı Sorusu",
                                color = MaterialTheme.colorScheme.primary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${currentIndex + 1} / ${questions.size}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = content.title,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = content.questionText,
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // Cevap Alanı
            item {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = if (language == Language.EN) "Your Answer" else "Yanıtınız",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                    OutlinedTextField(
                        value = userAnswer,
                        onValueChange = { userAnswer = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(130.dp),
                        shape = RoundedCornerShape(12.dp),
                        placeholder = {
                            Text(
                                if (language == Language.EN)
                                    "Explain your thoughts, trade-offs and architecture..."
                                else
                                    "Cevabınızı, mimari yaklaşımınızı ve gerekçenizi yazın..."
                            )
                        }
                    )
                }
            }

            // Değerlendirme Butonu
            if (evaluationScore == null) {
                item {
                    Button(
                        onClick = {
                            isEvaluating = true
                            isTimerActive = false
                            val answerLower = userAnswer.lowercase()
                            val matched = content.keyPoints.filter { pt ->
                                pt.lowercase().split(" ").any { answerLower.contains(it) }
                            }
                            val isEn = language == Language.EN
                            evaluationScore = minOf(95, maxOf(60, 50 + (matched.size * 14)))
                            evaluationStrengths = if (matched.isEmpty()) {
                                listOf(if (isEn) "Answer delivered with clear intent." else "Cevap anlaşılır bir niyetle sunuldu.")
                            } else {
                                matched.map { if (isEn) "Correctly highlighted '$it'." else "'$it' konusuna doğru temas edildi." }
                            }
                            evaluationImprovements = listOf(
                                if (isEn) "Could address memory footprint and concurrency trade-offs." else "Bellek ayak izi ve eşzamanlılık kısıtlarına daha detaylı değinilebilir."
                            )
                            followUpQuestion = if (isEn)
                                "How would you design unit tests or benchmarks to profile this?"
                            else
                                "Bu yaklaşımı test etmek veya profil çıkarmak için hangi araçları kullanırsınız?"
                            isEvaluating = false
                        },
                        enabled = userAnswer.trim().isNotEmpty() && !isEvaluating,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        if (isEvaluating) {
                            CircularProgressView()
                        } else {
                            Icon(Icons.Default.Star, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(if (language == Language.EN) "Evaluate with Gemini AI" else "Yapay Zeka ile Değerlendir")
                        }
                    }
                }
            } else {
                // Değerlendirme Kartı
                item {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.7f))
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = if (language == Language.EN) "Interview Score" else "Mülakat Skoru",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp
                                )
                                Text(
                                    text = "${evaluationScore} / 100",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }

                            Divider()

                            Text(
                                text = if (language == Language.EN) "Strengths" else "Güçlü Yönler",
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF2E7D32),
                                fontSize = 13.sp
                            )
                            evaluationStrengths.forEach { str ->
                                Text("• $str", fontSize = 13.sp)
                            }

                            Text(
                                text = if (language == Language.EN) "Areas for Improvement" else "Geliştirilmesi Gereken Yönler",
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFE65100),
                                fontSize = 13.sp
                            )
                            evaluationImprovements.forEach { imp ->
                                Text("• $imp", fontSize = 13.sp)
                            }

                            followUpQuestion?.let { fUp ->
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = MaterialTheme.colorScheme.tertiaryContainer.copy(alpha = 0.5f),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(10.dp)) {
                                        Text(
                                            text = if (language == Language.EN) "Follow-up Question" else "Derinleşme Sorusu",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.tertiary
                                        )
                                        Text(fUp, fontSize = 12.sp, fontStyle = androidx.compose.ui.text.font.FontStyle.Italic)
                                    }
                                }
                            }

                            Button(
                                onClick = {
                                    if (currentIndex < questions.size - 1) {
                                        currentIndex += 1
                                        userAnswer = ""
                                        timeLeft = 180
                                        isTimerActive = true
                                        evaluationScore = null
                                    } else {
                                        onClose()
                                    }
                                },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text(
                                    if (currentIndex < questions.size - 1) {
                                        if (language == Language.EN) "Next Question" else "Sıradaki Soruya Geç"
                                    } else {
                                        if (language == Language.EN) "Finish Simulation" else "Mülakatı Tamamla"
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CircularProgressView() {
    CircularProgressIndicator(
        modifier = Modifier.size(20.dp),
        color = Color.White,
        strokeWidth = 2.dp
    )
}
