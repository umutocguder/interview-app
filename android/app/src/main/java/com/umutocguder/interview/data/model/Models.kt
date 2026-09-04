package com.umutocguder.interview.data.model

enum class DifficultyLevel(val title: String) {
    JUNIOR("Junior"),
    MID("Mid-Level"),
    SENIOR("Senior")
}

data class Category(
    val id: String,
    val name: String,
    val slug: String,
    val icon: String,
    val description: String? = null
)

data class Question(
    val id: String,
    val title: String,
    val questionText: String,
    val idealAnswer: String,
    val difficulty: DifficultyLevel,
    val keyPoints: List<String> = emptyList(),
    val tags: List<String> = emptyList(),
    val isBookmarked: Boolean = false
)

data class AuthUser(
    val id: String,
    val email: String,
    val fullName: String? = null,
    val isDemo: Boolean = false
)

data class AIEvaluation(
    val score: Int,
    val strengths: List<String>,
    val improvements: List<String>,
    val suggestedAnswer: String,
    val followUpQuestion: String,
    val provider: String
)
