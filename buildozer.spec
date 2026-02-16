[app]

# (str) Title of your application
title = Fresh N'Good

# (str) Package name
package.name = freshngood

# (str) Package domain (needed for android/ios packaging)
package.domain = app.lovable.freshngood

# (str) Source files location (dir)
source.dir = dist

# (list) Source files to include (with wildcards)
source.include_exts = py,png,jpg,kv,ogg

# (str) Application version
version = 1.0.0

# (list) Permissions
android.permissions = INTERNET,ACCESS_NETWORK_STATE

# (int) Android NDK version to use
android.ndk = 25

# (int) Android API level to use
android.minapi = 21

# (int) Android SDK version to use
android.sdk = 33

# (str) Android NDK path
android.ndk_path =

# (str) Android SDK path
android.sdk_path =

# (list) Android archs to build
android.archs = arm64-v8a,armeabi-v7a

# (bool) Indicate if the application should be fullscreen or not
fullscreen = 0

# (str) Orientation (can be one of landscape, sensor, portrait or user)
orientation = portrait

# (list) Application icon
icon.filename = favicon.png

# (str) Presplash (splash screen) filename
presplash.filename = favicon.png

# (list) Supported platforms
[buildozer]

# (int) Target android API
android.api = 33

# (int) Target minimum android API
android.minapi = 21

# (str) NDK version
android.ndk = 25

# (int) Android SDK version
android.sdk = 33

# (str) Android arch
android.arch = arm64-v8a

# (bool) Debug mode
debug_mode = 0

# (bool) Copy libs instead of using --add-jars
android.copy_libs = 1

# (bool) AndroidX support
android.androidx = 1

# (bool) Gradle build
android.gradle_version = 7.2
