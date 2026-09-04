# Created by 11hopem (11 Hopem Software Ltd. Şti.)
# Copyright (c) 2026 11hopem. All rights reserved.
# Licensed under 11 Hopem Software Proprietary License.

import unittest


class TestInterviewLogic(unittest.TestCase):
    """Unit tests for interview session scoring and category filtering."""

    def setUp(self):
        self.categories = [
            {"id": "c1", "name": "iOS & Swift", "slug": "ios-swift"},
            {"id": "c2", "name": "Android & Kotlin", "slug": "android-kotlin"},
            {"id": "c3", "name": "Web & Frontend", "slug": "web-frontend"},
            {"id": "c4", "name": "System Design", "slug": "system-design"},
        ]
        self.questions = [
            {"id": "q1", "category_id": "c1", "title": "SwiftUI Observation", "difficulty": "mid"},
            {"id": "q2", "category_id": "c1", "title": "Swift Concurrency", "difficulty": "senior"},
            {"id": "q3", "category_id": "c2", "title": "Kotlin Coroutines", "difficulty": "junior"},
            {"id": "q4", "category_id": "c3", "title": "React 19 Hooks", "difficulty": "mid"},
        ]

    def test_filter_by_category(self):
        """Test filtering questions by category."""
        ios_questions = [q for q in self.questions if q["category_id"] == "c1"]
        self.assertEqual(len(ios_questions), 2)
        self.assertEqual(ios_questions[0]["title"], "SwiftUI Observation")

    def test_filter_by_difficulty(self):
        """Test filtering questions by difficulty level."""
        mid_questions = [q for q in self.questions if q["difficulty"] == "mid"]
        self.assertEqual(len(mid_questions), 2)

    def test_session_score_calculation(self):
        """Test calculating percentage score from interview answers."""
        user_answers = [
            {"question_id": "q1", "self_score": 4},  # max 5
            {"question_id": "q2", "self_score": 5},
            {"question_id": "q3", "self_score": 3},
        ]
        total_score = sum(a["self_score"] for a in user_answers)
        max_possible = len(user_answers) * 5
        percentage = round((total_score / max_possible) * 100)

        self.assertEqual(total_score, 12)
        self.assertEqual(percentage, 80)

if __name__ == "__main__":
    unittest.main()
