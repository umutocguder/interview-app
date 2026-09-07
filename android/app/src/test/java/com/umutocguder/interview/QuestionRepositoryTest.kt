package com.umutocguder.interview

import com.umutocguder.interview.data.model.DifficultyLevel
import com.umutocguder.interview.data.model.Language
import com.umutocguder.interview.data.repository.QuestionRepository
import org.junit.Assert.*
import org.junit.Test

class QuestionRepositoryTest {

    @Test
    fun testQuestionsCompletenessAndLocalization() {
        val questions = QuestionRepository.questions
        assertTrue("Questions list should not be empty", questions.isNotEmpty())

        for (q in questions) {
            val tr = q.getContent(Language.TR)
            assertTrue("TR title should not be empty for ${q.id}", tr.title.isNotEmpty())
            assertTrue("TR questionText should not be empty for ${q.id}", tr.questionText.isNotEmpty())
            assertTrue("TR idealAnswer should not be empty for ${q.id}", tr.idealAnswer.isNotEmpty())
            assertTrue("TR keyPoints should not be empty for ${q.id}", tr.keyPoints.isNotEmpty())

            val en = q.getContent(Language.EN)
            assertTrue("EN title should not be empty for ${q.id}", en.title.isNotEmpty())
            assertTrue("EN questionText should not be empty for ${q.id}", en.questionText.isNotEmpty())
            assertTrue("EN idealAnswer should not be empty for ${q.id}", en.idealAnswer.isNotEmpty())
            assertTrue("EN keyPoints should not be empty for ${q.id}", en.keyPoints.isNotEmpty())

            assertNotEquals("TR and EN titles should be distinct for ${q.id}", tr.title, en.title)
        }
    }

    @Test
    fun testCategoryLocalization() {
        val categories = QuestionRepository.categories
        assertTrue("Categories list should not be empty", categories.isNotEmpty())

        for (cat in categories) {
            val tr = cat.getContent(Language.TR)
            val en = cat.getContent(Language.EN)
            assertTrue("TR category name should not be empty", tr.name.isNotEmpty())
            assertTrue("EN category name should not be empty", en.name.isNotEmpty())
        }
    }

    @Test
    fun testDifficultyFilter() {
        val questions = QuestionRepository.questions
        val seniorOnly = questions.filter { it.difficulty == DifficultyLevel.SENIOR }
        assertTrue("Should have senior questions", seniorOnly.isNotEmpty())
        assertTrue("All filtered questions must be senior", seniorOnly.all { it.difficulty == DifficultyLevel.SENIOR })
    }
}
