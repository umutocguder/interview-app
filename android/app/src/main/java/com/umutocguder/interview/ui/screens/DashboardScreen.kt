package com.umutocguder.interview.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.umutocguder.interview.data.model.Category
import com.umutocguder.interview.data.model.DifficultyLevel
import com.umutocguder.interview.data.model.Question

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen() {
    val categories = remember {
        listOf(
            Category("1", "Android & Kotlin", "android", "android", "Compose, Coroutines & MVI"),
            Category("2", "iOS & Swift", "ios", "apple", "SwiftUI, Concurrency & ARC"),
            Category("3", "Web & Frontend", "web", "globe", "Next.js, React 19 & TS"),
            Category("4", "System Design", "system-design", "layers", "Microservices & Caching")
        )
    }

    val sampleQuestions = remember {
        listOf(
            Question(
                "q1",
                "Compose Recomposition & State Hoisting",
                "State hoisting prensibi neden uygulanmalıdır?",
                "Stateless bileşenler test edilebilirliği ve yeniden kullanımı artırır.",
                DifficultyLevel.MID,
                listOf("Android", "Compose")
            ),
            Question(
                "q2",
                "Kotlin Coroutines vs Threads",
                "Coroutines neden lightweight threads olarak adlandırılır?",
                "OS thread'lerini bloke etmeden suspend edilebilirler.",
                DifficultyLevel.SENIOR,
                listOf("Kotlin", "Coroutines")
            )
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Mülakat Hazırlık", fontWeight = FontWeight.Bold) },
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
            item {
                // Banner
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            brush = Brush.linearGradient(
                                colors = listOf(Color(0xFF1976D2), Color(0xFF512DA8))
                            ),
                            shape = RoundedCornerShape(16.dp)
                        )
                        .padding(20.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            text = "🚀 Canlı Mülakat Simülatörü",
                            color = Color.White,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Zamanlı mülakat simülasyonu ile seviyeni test et.",
                            color = Color.White.copy(alpha = 0.9f),
                            fontSize = 14.sp
                        )
                        Button(
                            onClick = { /* Simülasyon başlat */ },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.padding(top = 4.dp)
                        ) {
                            Text("Simülasyonu Başlat", color = Color(0xFF1976D2), fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            item {
                Text(
                    text = "Kategoriler",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            items(categories) { category ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(category.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        category.description?.let {
                            Text(it, color = Color.Gray, fontSize = 13.sp, modifier = Modifier.padding(top = 4.dp))
                        }
                    }
                }
            }

            item {
                Text(
                    text = "Günün Soruları",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            items(sampleQuestions) { question ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                    modifier = Modifier.fillMaxWidth().clickable { /* Soru detayı */ }
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = question.difficulty.title,
                                color = Color(0xFFF57C00),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.weight(1f))
                            Text("#" + question.tags.firstOrNull().orEmpty(), color = Color.Gray, fontSize = 12.sp)
                        }
                        Text(
                            text = question.title,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 15.sp,
                            modifier = Modifier.padding(top = 6.dp)
                        )
                    }
                }
            }
        }
    }
}
