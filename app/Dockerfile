FROM node:18-bullseye

# Install Java and Android SDK
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk wget unzip \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Install Android command line tools
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    cd $ANDROID_HOME/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline.zip && \
    unzip -q cmdline.zip && \
    mv cmdline-tools latest && \
    rm cmdline.zip

# Accept licenses and install SDK components
RUN yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
RUN $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

WORKDIR /app

# Copy project
COPY . .

# Install dependencies and build
RUN npm install
RUN npx expo prebuild --platform android
RUN cd android && ./gradlew assembleDebug

# Output APK
CMD ["ls", "-la", "app/build/outputs/apk/debug/"]
