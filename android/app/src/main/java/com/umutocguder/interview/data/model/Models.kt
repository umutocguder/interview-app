package com.umutocguder.interview.data.model

enum class Language(val displayName: String, val shortCode: String, val bcp47: String) {
    TR("🇹🇷 Türkçe", "TR", "tr-TR"),
    EN("🇬🇧 English", "EN", "en-US")
}

enum class DifficultyLevel(val title: String) {
    JUNIOR("Junior"),
    MID("Mid-Level"),
    SENIOR("Senior");

    fun localizedTitle(lang: Language): String = when (this) {
        JUNIOR -> "Junior"
        MID -> if (lang == Language.TR) "Orta Seviye (Mid)" else "Mid-Level"
        SENIOR -> if (lang == Language.TR) "Kıdemli (Senior)" else "Senior"
    }
}

data class LocalizedContent(
    val title: String,
    val questionText: String,
    val idealAnswer: String,
    val hints: List<String> = emptyList(),
    val keyPoints: List<String> = emptyList()
)

data class LocalizedCategoryContent(
    val name: String,
    val description: String? = null
)

data class Category(
    val id: String,
    val slug: String,
    val icon: String,
    val displayOrder: Int = 0,
    val tr: LocalizedCategoryContent,
    val en: LocalizedCategoryContent
) {
    fun getContent(lang: Language): LocalizedCategoryContent = if (lang == Language.EN) en else tr
}

data class Question(
    val id: String,
    val categoryId: String? = null,
    val difficulty: DifficultyLevel,
    val tags: List<String> = emptyList(),
    val tr: LocalizedContent,
    val en: LocalizedContent,
    var isBookmarked: Boolean = false
) {
    fun getContent(lang: Language): LocalizedContent = if (lang == Language.EN) en else tr
}

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
