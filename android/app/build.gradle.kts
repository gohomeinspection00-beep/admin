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
        // ARCore memerlukan 24; stack UVC sendiri menyokong 21, tetapi
        // telefon yang boleh menjalankan AR semuanya jauh melepasi ini.
        minSdk = 24
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
    // ARCore. WebXR dikompil ke dalam Chrome dan tidak boleh disuntik ke
    // dalam WebView, tetapi ARCore ialah pustaka Android biasa, jadi app ini
    // boleh menjalankan AR sendiri dan menghantar titiknya kembali ke Pocket.
    implementation("com.google.ar:core:1.42.0")
}
