package com.umutocguder.interview

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.umutocguder.interview.ui.screens.DashboardScreen
import com.umutocguder.interview.ui.theme.InterviewAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            InterviewAppTheme {
                DashboardScreen()
            }
        }
    }
}
