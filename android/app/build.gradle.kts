plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "my.goxpert.pocket"
    compileSdk = 34

    defaultConfig {
        applicationId = "my.goxpert.pocket"
        // Pustaka UVC menyokong Android 5.0 ke atas.
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        // Hanya debug: APK ini dipasang terus, bukan melalui Play Store,
        // jadi ia ditandatangani dengan kunci debug yang Gradle jana sendiri.
        getByName("debug") {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }

    packaging {
        resources.excludes += setOf("META-INF/*")
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.core:core-ktx:1.12.0")
    // Stack UVC: mengendalikan kebenaran USB, membuka peranti dan bingkai.
    implementation("com.herohan:UVCAndroid:1.0.13")
    // Pelayan HTTP kecil supaya Pocket dan strim berada pada asal yang sama.
    implementation("org.nanohttpd:nanohttpd:2.3.1")
}
